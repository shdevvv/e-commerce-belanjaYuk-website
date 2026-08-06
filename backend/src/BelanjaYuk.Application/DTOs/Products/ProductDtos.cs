namespace BelanjaYuk.Application.DTOs.Products;

public class ProductDto
{
    public string IdProduct { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public string ProductDesc { get; set; } = string.Empty;
    public string IdCategory { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public decimal Price { get; set; } // Original price
    public decimal DiscountProduct { get; set; } // Discount amount in IDR
    public decimal DiscountedPrice => Price - DiscountProduct; // Price after discount
    public decimal DiscountPercentage => Price > 0 ? Math.Round((DiscountProduct / Price) * 100, 0) : 0;
    public int Qty { get; set; } // Stock
    public string ImageUrl { get; set; } = string.Empty;
}
