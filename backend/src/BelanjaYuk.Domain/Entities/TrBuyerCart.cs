using System;

namespace BelanjaYuk.Domain.Entities;

public class TrBuyerCart
{
    public string IdBuyerCart { get; set; } = Guid.NewGuid().ToString();
    public string IdUser { get; set; } = string.Empty;
    public MsUser? User { get; set; }
    public string IdProduct { get; set; } = string.Empty;
    public MsProduct? Product { get; set; }
    public int Qty { get; set; }

    public DateTime DateIn { get; set; } = DateTime.UtcNow;
    public string UserIn { get; set; } = "System";
    public DateTime? DateUp { get; set; }
    public string? UserUp { get; set; }
    public bool IsActive { get; set; } = true;
}
