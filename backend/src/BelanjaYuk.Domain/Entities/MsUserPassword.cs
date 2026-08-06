using System;

namespace BelanjaYuk.Domain.Entities;

public class MsUserPassword
{
    public string IdUserPassword { get; set; } = Guid.NewGuid().ToString();
    public string IdUser { get; set; } = string.Empty;
    public MsUser? User { get; set; }
    public string PasswordHash { get; set; } = string.Empty;

    public DateTime DateIn { get; set; } = DateTime.UtcNow;
    public string UserIn { get; set; } = "System";
    public DateTime? DateUp { get; set; }
    public string? UserUp { get; set; }
    public bool IsActive { get; set; } = true;
}
