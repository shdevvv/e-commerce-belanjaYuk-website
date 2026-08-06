using System;

namespace BelanjaYuk.Domain.Entities;

public class TrBuyerTransactionDetail
{
    public string IdBuyerTransactionDetail { get; set; } = Guid.NewGuid().ToString();
    public string IdBuyerTransaction { get; set; } = string.Empty;
    public TrBuyerTransaction? Transaction { get; set; }
    public string IdProduct { get; set; } = string.Empty;
    public MsProduct? Product { get; set; }
    public int Qty { get; set; }
    public decimal PriceProduct { get; set; }
    public decimal DiscountProduct { get; set; }
    public int? Rating { get; set; }
    public string? RatingComment { get; set; }

    public DateTime DateIn { get; set; } = DateTime.UtcNow;
    public string UserIn { get; set; } = "System";
    public DateTime? DateUp { get; set; }
    public string? UserUp { get; set; }
    public bool IsActive { get; set; } = true;
}
