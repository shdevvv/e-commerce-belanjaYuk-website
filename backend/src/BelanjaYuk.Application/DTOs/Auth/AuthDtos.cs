using System;
using System.ComponentModel.DataAnnotations;

namespace BelanjaYuk.Application.DTOs.Auth;

public class RegisterRequest
{
    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [StringLength(30, MinimumLength = 5)]
    public string UserName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string Password { get; set; } = string.Empty;

    public DateTime? DOB { get; set; }
    public string? GenderName { get; set; }

    // Address fields (Optional)
    public string? Provinsi { get; set; }
    public string? KotaKabupaten { get; set; }
    public string? Kecamatan { get; set; }
    public string? KodePos { get; set; }
    public string? AlamatLengkap { get; set; }
}

public class LoginRequest
{
    [Required]
    public string EmailOrPhone { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public string IdUser { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string EmailOrPhone { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
}
