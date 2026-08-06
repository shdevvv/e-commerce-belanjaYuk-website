using System;

namespace BelanjaYuk.Domain.Entities;

public class TrProductImages
{
    public string IdProductImages { get; set; } = Guid.NewGuid().ToString();
    public string IdProduct { get; set; } = string.Empty;
    public MsProduct? Product { get; set; }
    public string ProductImage { get; set; } = string.Empty;

    public DateTime DateIn { get; set; } = DateTime.UtcNow;
    public string UserIn { get; set; } = "System";
    public DateTime? DateUp { get; set; }
    public string? UserUp { get; set; }
    public bool IsActive { get; set; } = true;
}
