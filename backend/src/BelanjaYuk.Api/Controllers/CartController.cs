using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using BelanjaYuk.Application.Common.Models;
using BelanjaYuk.Application.DTOs.Cart;
using BelanjaYuk.Application.Interfaces;
using BelanjaYuk.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BelanjaYuk.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/[controller]")]
public class CartController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public CartController(IApplicationDbContext context)
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

    [HttpGet]
    public async Task<ActionResult<ApiResponse<CartSummaryDto>>> GetCart()
    {
        var userId = GetUserId();

        var cartItems = await _context.TrBuyerCarts
            .Include(c => c.Product)
                .ThenInclude(p => p!.Images)
            .Where(c => c.IdUser == userId && c.IsActive)
            .ToListAsync();

        var itemDtos = cartItems.Where(c => c.Product != null && c.Product.IsActive).Select(c => new CartItemDto
        {
            IdBuyerCart = c.IdBuyerCart,
            IdProduct = c.IdProduct,
            ProductName = c.Product!.ProductName,
            ImageUrl = c.Product.Images.FirstOrDefault() != null ? c.Product.Images.FirstOrDefault()!.ProductImage : "https://via.placeholder.com/600",
            Price = c.Product.Price,
            DiscountProduct = c.Product.DiscountProduct,
            Qty = c.Qty
        }).ToList();

        var summary = new CartSummaryDto
        {
            Items = itemDtos,
            TotalItems = itemDtos.Sum(i => i.Qty),
            TotalOriginalAmount = itemDtos.Sum(i => i.SubtotalOriginal),
            TotalDiscountAmount = itemDtos.Sum(i => i.SubtotalOriginal - i.SubtotalDiscounted),
            TotalFinalAmount = itemDtos.Sum(i => i.SubtotalDiscounted)
        };

        return Ok(ApiResponse<CartSummaryDto>.Ok(summary));
    }

    [HttpPost("items")]
    public async Task<ActionResult<ApiResponse<CartSummaryDto>>> AddItem([FromBody] AddToCartRequest request)
    {
        var userId = GetUserId();

        var product = await _context.MsProducts.FirstOrDefaultAsync(p => p.IdProduct == request.IdProduct && p.IsActive);
        if (product == null)
        {
            return NotFound(ApiResponse<CartSummaryDto>.Fail("Produk tidak ditemukan."));
        }

        var existingItem = await _context.TrBuyerCarts.FirstOrDefaultAsync(c => c.IdUser == userId && c.IdProduct == request.IdProduct && c.IsActive);

        if (existingItem != null)
        {
            existingItem.Qty += request.Qty;
        }
        else
        {
            var newItem = new TrBuyerCart
            {
                IdBuyerCart = Guid.NewGuid().ToString(),
                IdUser = userId,
                IdProduct = request.IdProduct,
                Qty = request.Qty
            };
            _context.TrBuyerCarts.Add(newItem);
        }

        await _context.SaveChangesAsync();
        return await GetCart();
    }

    [HttpPut("items/{id}")]
    public async Task<ActionResult<ApiResponse<CartSummaryDto>>> UpdateQuantity(string id, [FromBody] UpdateCartQuantityRequest request)
    {
        var userId = GetUserId();

        var cartItem = await _context.TrBuyerCarts.FirstOrDefaultAsync(c => c.IdBuyerCart == id && c.IdUser == userId);
        if (cartItem == null)
        {
            return NotFound(ApiResponse<CartSummaryDto>.Fail("Item keranjang tidak ditemukan."));
        }

        if (request.Qty <= 0)
        {
            _context.TrBuyerCarts.Remove(cartItem);
        }
        else
        {
            cartItem.Qty = request.Qty;
        }

        await _context.SaveChangesAsync();
        return await GetCart();
    }

    [HttpDelete("items/{id}")]
    public async Task<ActionResult<ApiResponse<CartSummaryDto>>> RemoveItem(string id)
    {
        var userId = GetUserId();

        var cartItem = await _context.TrBuyerCarts.FirstOrDefaultAsync(c => c.IdBuyerCart == id && c.IdUser == userId);
        if (cartItem != null)
        {
            _context.TrBuyerCarts.Remove(cartItem);
            await _context.SaveChangesAsync();
        }

        return await GetCart();
    }

    [HttpDelete]
    public async Task<ActionResult<ApiResponse<bool>>> ClearCart()
    {
        var userId = GetUserId();
        var items = await _context.TrBuyerCarts.Where(c => c.IdUser == userId).ToListAsync();
        _context.TrBuyerCarts.RemoveRange(items);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<bool>.Ok(true, "Keranjang belanja berhasil dikosongkan."));
    }
}
