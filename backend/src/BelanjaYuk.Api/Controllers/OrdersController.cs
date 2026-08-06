using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using BelanjaYuk.Application.Common.Models;
using BelanjaYuk.Application.DTOs.Orders;
using BelanjaYuk.Application.Interfaces;
using BelanjaYuk.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BelanjaYuk.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public OrdersController(IApplicationDbContext context)
    {
        _context = context;
    }

    private string GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");
        if (claim == null || string.IsNullOrEmpty(claim.Value))
        {
            throw new UnauthorizedAccessException("User context is invalid.");
        }
        return claim.Value;
    }

    [AllowAnonymous]
    [HttpGet("payment-methods")]
    public async Task<ActionResult<ApiResponse<List<PaymentMethodDto>>>> GetPaymentMethods()
    {
        var methods = await _context.LtPayments
            .AsNoTracking()
            .Where(p => p.IsActive)
            .Select(p => new PaymentMethodDto
            {
                IdPayment = p.IdPayment,
                PaymentName = p.PaymentName
            })
            .ToListAsync();

        return Ok(ApiResponse<List<PaymentMethodDto>>.Ok(methods));
    }

    [HttpPost("checkout")]
    public async Task<ActionResult<ApiResponse<TransactionDto>>> Checkout([FromBody] CheckoutRequest request)
    {
        var userId = GetUserId();

        var cartItems = await _context.TrBuyerCarts
            .Include(c => c.Product)
            .Where(c => c.IdUser == userId && c.IsActive)
            .ToListAsync();

        if (!cartItems.Any())
        {
            return BadRequest(ApiResponse<TransactionDto>.Fail("Keranjang kosong."));
        }

        // Fetch payment method from LtPayment table
        var payment = await _context.LtPayments.FirstOrDefaultAsync(p => p.IdPayment == request.IdPayment && p.IsActive);
        if (payment == null)
        {
            // Fallback by name if IdPayment matched payment name
            payment = await _context.LtPayments.FirstOrDefaultAsync(p => p.PaymentName.ToLower().Contains(request.IdPayment.ToLower()))
                      ?? await _context.LtPayments.FirstOrDefaultAsync();
        }

        if (payment == null)
        {
            return BadRequest(ApiResponse<TransactionDto>.Fail("Metode pembayaran wajib dipilih dari database."));
        }

        var transactionId = Guid.NewGuid().ToString();
        var details = new List<TrBuyerTransactionDetail>();
        decimal totalFinal = 0m;
        decimal totalOriginal = 0m;

        foreach (var item in cartItems)
        {
            if (item.Product == null || !item.Product.IsActive) continue;

            var origPrice = item.Product.Price;
            var discAmt = item.Product.DiscountProduct;
            var unitPrice = origPrice - discAmt;
            var qty = Math.Clamp(item.Qty, 1, 99); // Quantity validation 1..99

            totalOriginal += origPrice * qty;
            totalFinal += unitPrice * qty;

            details.Add(new TrBuyerTransactionDetail
            {
                IdBuyerTransactionDetail = Guid.NewGuid().ToString(),
                IdBuyerTransaction = transactionId,
                IdProduct = item.IdProduct,
                Qty = qty,
                PriceProduct = origPrice,
                DiscountProduct = discAmt
            });

            // Reduce product stock
            if (item.Product.Qty >= qty)
            {
                item.Product.Qty -= qty;
            }
        }

        var transaction = new TrBuyerTransaction
        {
            IdBuyerTransaction = transactionId,
            IdUser = userId,
            IdPayment = payment.IdPayment,
            Payment = payment,
            FinalPrice = totalFinal,
            DateIn = DateTime.UtcNow,
            Details = details
        };

        _context.TrBuyerTransactions.Add(transaction);

        // Clear user's cart
        _context.TrBuyerCarts.RemoveRange(cartItems);

        await _context.SaveChangesAsync();

        var dto = new TransactionDto
        {
            IdBuyerTransaction = transaction.IdBuyerTransaction,
            PaymentName = payment.PaymentName,
            TotalOriginalAmount = totalOriginal,
            TotalDiscountAmount = totalOriginal - totalFinal,
            FinalPrice = totalFinal,
            DateIn = transaction.DateIn,
            Details = details.Select(d => new TransactionDetailDto
            {
                IdBuyerTransactionDetail = d.IdBuyerTransactionDetail,
                IdProduct = d.IdProduct,
                ProductName = cartItems.FirstOrDefault(c => c.IdProduct == d.IdProduct)?.Product?.ProductName ?? "Produk BelanjaYuk",
                PriceProduct = d.PriceProduct,
                DiscountProduct = d.DiscountProduct,
                Qty = d.Qty
            }).ToList()
        };

        return Ok(ApiResponse<TransactionDto>.Ok(dto, "Barang berhasil ter-checkout."));
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<TransactionDto>>>> GetOrders()
    {
        var userId = GetUserId();

        var transactions = await _context.TrBuyerTransactions
            .Include(t => t.Payment)
            .Include(t => t.Details)
                .ThenInclude(d => d.Product)
            .Where(t => t.IdUser == userId && t.IsActive)
            .OrderByDescending(t => t.DateIn)
            .ToListAsync();

        var dtos = transactions.Select(t => new TransactionDto
        {
            IdBuyerTransaction = t.IdBuyerTransaction,
            PaymentName = t.Payment != null ? t.Payment.PaymentName : "Transfer Bank",
            TotalOriginalAmount = t.Details.Sum(d => d.PriceProduct * d.Qty),
            TotalDiscountAmount = t.Details.Sum(d => d.DiscountProduct * d.Qty),
            FinalPrice = t.FinalPrice,
            DateIn = t.DateIn,
            Details = t.Details.Select(d => new TransactionDetailDto
            {
                IdBuyerTransactionDetail = d.IdBuyerTransactionDetail,
                IdProduct = d.IdProduct,
                ProductName = d.Product != null ? d.Product.ProductName : "Produk",
                PriceProduct = d.PriceProduct,
                DiscountProduct = d.DiscountProduct,
                Qty = d.Qty
            }).ToList()
        }).ToList();

        return Ok(ApiResponse<List<TransactionDto>>.Ok(dtos));
    }
}
