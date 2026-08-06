using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BelanjaYuk.Application.Common.Models;
using BelanjaYuk.Application.DTOs.Products;
using BelanjaYuk.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BelanjaYuk.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public ProductsController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<ProductDto>>>> GetProducts(
        [FromQuery] string? q,
        [FromQuery] string? category)
    {
        var query = _context.MsProducts
            .Include(p => p.Category)
            .Include(p => p.Images)
            .AsNoTracking()
            .Where(p => p.IsActive);

        if (!string.IsNullOrWhiteSpace(q))
        {
            var searchTerm = q.Trim().ToLower();
            query = query.Where(p => p.ProductName.ToLower().Contains(searchTerm) ||
                                     p.ProductDesc.ToLower().Contains(searchTerm));
        }

        if (!string.IsNullOrWhiteSpace(category) && category != "Semua")
        {
            var categoryTerm = category.Trim().ToLower();
            query = query.Where(p => p.Category != null && p.Category.CategoryName.ToLower() == categoryTerm);
        }

        var products = await query.Select(p => new ProductDto
        {
            IdProduct = p.IdProduct,
            ProductName = p.ProductName,
            ProductDesc = p.ProductDesc,
            IdCategory = p.IdCategory,
            CategoryName = p.Category != null ? p.Category.CategoryName : "Umum",
            Price = p.Price,
            DiscountProduct = p.DiscountProduct,
            Qty = p.Qty,
            ImageUrl = p.Images.FirstOrDefault() != null ? p.Images.FirstOrDefault()!.ProductImage : "https://via.placeholder.com/600"
        }).ToListAsync();

        return Ok(ApiResponse<List<ProductDto>>.Ok(products));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<ProductDto>>> GetProductById(string id)
    {
        var p = await _context.MsProducts
            .Include(x => x.Category)
            .Include(x => x.Images)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.IdProduct == id && x.IsActive);

        if (p == null)
        {
            return NotFound(ApiResponse<ProductDto>.Fail("Produk tidak ditemukan."));
        }

        var dto = new ProductDto
        {
            IdProduct = p.IdProduct,
            ProductName = p.ProductName,
            ProductDesc = p.ProductDesc,
            IdCategory = p.IdCategory,
            CategoryName = p.Category != null ? p.Category.CategoryName : "Umum",
            Price = p.Price,
            DiscountProduct = p.DiscountProduct,
            Qty = p.Qty,
            ImageUrl = p.Images.FirstOrDefault() != null ? p.Images.FirstOrDefault()!.ProductImage : "https://via.placeholder.com/600"
        };

        return Ok(ApiResponse<ProductDto>.Ok(dto));
    }
}
