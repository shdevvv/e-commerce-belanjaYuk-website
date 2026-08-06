using System;

namespace BelanjaYuk.Domain.Entities;

public class MsUser
{
    public string IdUser { get; set; } = Guid.NewGuid().ToString();
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime? DOB { get; set; }
    public string? IdGender { get; set; }
    public LtGender? Gender { get; set; }

    public DateTime DateIn { get; set; } = DateTime.UtcNow;
    public string UserIn { get; set; } = "System";
    public DateTime? DateUp { get; set; }
    public string? UserUp { get; set; }
    public bool IsActive { get; set; } = true;

    public MsUserPassword? UserPassword { get; set; }
}
