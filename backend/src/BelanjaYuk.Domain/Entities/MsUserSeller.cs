using System;

namespace BelanjaYuk.Domain.Entities;

public class MsUserSeller
{
    public string IdUserSeller { get; set; } = Guid.NewGuid().ToString();
    public string IdUser { get; set; } = string.Empty;
    public MsUser? User { get; set; }
    public string SellerName { get; set; } = string.Empty;
    public string SellerDesc { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string SellerCode { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;

    public DateTime DateIn { get; set; } = DateTime.UtcNow;
    public string UserIn { get; set; } = "System";
    public DateTime? DateUp { get; set; }
    public string? UserUp { get; set; }
    public bool IsActive { get; set; } = true;
}
