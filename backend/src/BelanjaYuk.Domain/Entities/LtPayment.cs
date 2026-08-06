using System;

namespace BelanjaYuk.Domain.Entities;

public class LtPayment
{
    public string IdPayment { get; set; } = Guid.NewGuid().ToString();
    public string PaymentName { get; set; } = string.Empty;

    public DateTime DateIn { get; set; } = DateTime.UtcNow;
    public string UserIn { get; set; } = "System";
    public DateTime? DateUp { get; set; }
    public string? UserUp { get; set; }
    public bool IsActive { get; set; } = true;
}
