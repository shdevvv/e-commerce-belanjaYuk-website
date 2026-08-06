using System;
using System.Collections.Generic;

namespace BelanjaYuk.Domain.Entities;

public class MsProduct
{
    public string IdProduct { get; set; } = Guid.NewGuid().ToString();
    public string IdUserSeller { get; set; } = string.Empty;
    public MsUserSeller? Seller { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ProductDesc { get; set; } = string.Empty;
    public string IdCategory { get; set; } = string.Empty;
    public LtCategory? Category { get; set; }
    public decimal Price { get; set; }
    public decimal DiscountProduct { get; set; } // Discount amount in IDR or percentage
    public int Qty { get; set; }

    public DateTime DateIn { get; set; } = DateTime.UtcNow;
    public string UserIn { get; set; } = "System";
    public DateTime? DateUp { get; set; }
    public string? UserUp { get; set; }
    public bool IsActive { get; set; } = true;

    public List<TrProductImages> Images { get; set; } = new();
}
