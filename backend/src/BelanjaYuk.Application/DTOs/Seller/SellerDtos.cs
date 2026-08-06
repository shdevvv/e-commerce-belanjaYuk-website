using System;
using System.ComponentModel.DataAnnotations;

namespace BelanjaYuk.Application.DTOs.Seller;

public class RegisterSellerRequest
{
    [Required(ErrorMessage = "Nama toko/penjual wajib diisi.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "Nama toko harus 3–100 karakter.")]
    public string SellerName { get; set; } = string.Empty;

    [StringLength(1000, ErrorMessage = "Deskripsi toko maksimal 1000 karakter.")]
    public string? SellerDesc { get; set; }

    [StringLength(500, ErrorMessage = "Alamat toko maksimal 500 karakter.")]
    public string? Address { get; set; }

    [Required(ErrorMessage = "Nomor telepon operasional toko wajib diisi.")]
    public string PhoneNumber { get; set; } = string.Empty;
}

public class SellerDto
{
    public string IdUserSeller { get; set; } = string.Empty;
    public string IdUser { get; set; } = string.Empty;
    public string SellerName { get; set; } = string.Empty;
    public string SellerDesc { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string SellerCode { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime DateIn { get; set; }
}
