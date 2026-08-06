using System;

namespace BelanjaYuk.Domain.Entities;

public class LtCategory
{
    public string IdCategory { get; set; } = Guid.NewGuid().ToString();
    public string CategoryName { get; set; } = string.Empty;

    public DateTime DateIn { get; set; } = DateTime.UtcNow;
    public string UserIn { get; set; } = "System";
    public DateTime? DateUp { get; set; }
    public string? UserUp { get; set; }
    public bool IsActive { get; set; } = true;
}
