using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using BelanjaYuk.Application.Common.Models;
using BelanjaYuk.Application.DTOs.Seller;
using BelanjaYuk.Application.Interfaces;
using BelanjaYuk.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BelanjaYuk.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/[controller]")]
public class SellersController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public SellersController(IApplicationDbContext context)
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

    [HttpGet("me")]
    public async Task<ActionResult<ApiResponse<SellerDto>>> GetMySeller()
    {
        var userId = GetUserId();

        var seller = await _context.MsUserSellers
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.IdUser == userId && s.IsActive);

        if (seller == null)
        {
            return Ok(ApiResponse<SellerDto?>.Ok(null, "Pengguna belum memiliki toko penjual."));
        }

        var dto = new SellerDto
        {
            IdUserSeller = seller.IdUserSeller,
            IdUser = seller.IdUser,
            SellerName = seller.SellerName,
            SellerDesc = seller.SellerDesc ?? string.Empty,
            Address = seller.Address ?? string.Empty,
            SellerCode = seller.SellerCode,
            PhoneNumber = seller.PhoneNumber,
            IsActive = seller.IsActive,
            DateIn = seller.DateIn
        };

        return Ok(ApiResponse<SellerDto>.Ok(dto, "Data toko penjual berhasil didapatkan."));
    }

    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<SellerDto>>> RegisterSeller([FromBody] RegisterSellerRequest request)
    {
        var userId = GetUserId();

        var existingSeller = await _context.MsUserSellers
            .FirstOrDefaultAsync(s => s.IdUser == userId && s.IsActive);

        if (existingSeller != null)
        {
            return BadRequest(ApiResponse<SellerDto>.Fail("Pengguna sudah terdaftar sebagai penjual/memiliki toko aktif."));
        }

        if (string.IsNullOrWhiteSpace(request.SellerName))
        {
            return BadRequest(ApiResponse<SellerDto>.Fail("Nama toko/penjual wajib diisi."));
        }

        if (string.IsNullOrWhiteSpace(request.PhoneNumber))
        {
            return BadRequest(ApiResponse<SellerDto>.Fail("Nomor telepon toko wajib diisi."));
        }

        // Generate unique seller code (e.g., BY-STORE-8F3A)
        var randomCode = Guid.NewGuid().ToString().Substring(0, 6).ToUpper();
        var sellerCode = $"BY-STORE-{randomCode}";

        var sellerId = Guid.NewGuid().ToString();

        var seller = new MsUserSeller
        {
            IdUserSeller = sellerId,
            IdUser = userId,
            SellerName = request.SellerName.Trim(),
            SellerDesc = request.SellerDesc?.Trim() ?? string.Empty,
            Address = request.Address?.Trim() ?? string.Empty,
            SellerCode = sellerCode,
            PhoneNumber = request.PhoneNumber.Trim(),
            DateIn = DateTime.UtcNow,
            UserIn = userId,
            IsActive = true
        };

        _context.MsUserSellers.Add(seller);
        await _context.SaveChangesAsync();

        var dto = new SellerDto
        {
            IdUserSeller = seller.IdUserSeller,
            IdUser = seller.IdUser,
            SellerName = seller.SellerName,
            SellerDesc = seller.SellerDesc ?? string.Empty,
            Address = seller.Address ?? string.Empty,
            SellerCode = seller.SellerCode,
            PhoneNumber = seller.PhoneNumber,
            IsActive = seller.IsActive,
            DateIn = seller.DateIn
        };

        return Ok(ApiResponse<SellerDto>.Ok(dto, "Selamat! Toko Penjual BelanjaYuk Anda berhasil didaftarkan."));
    }
}
