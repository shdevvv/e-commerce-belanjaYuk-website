using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BelanjaYuk.Application.DTOs.Cart;

public class CartItemDto
{
    public string IdBuyerCart { get; set; } = string.Empty;
    public string IdProduct { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public decimal Price { get; set; } // Original price
    public decimal DiscountProduct { get; set; } // Discount amount per item
    public decimal DiscountedPrice => Price - DiscountProduct; // Price after discount
    public int Qty { get; set; }
    public decimal SubtotalOriginal => Price * Qty;
    public decimal SubtotalDiscounted => DiscountedPrice * Qty;
}

public class CartSummaryDto
{
    public List<CartItemDto> Items { get; set; } = new();
    public int TotalItems { get; set; }
    public decimal TotalOriginalAmount { get; set; }
    public decimal TotalDiscountAmount { get; set; }
    public decimal TotalFinalAmount { get; set; }
}

public class AddToCartRequest
{
    [Required]
    public string IdProduct { get; set; } = string.Empty;

    [Range(1, 100)]
    public int Qty { get; set; } = 1;
}

public class UpdateCartQuantityRequest
{
    [Range(1, 100)]
    public int Qty { get; set; }
}
