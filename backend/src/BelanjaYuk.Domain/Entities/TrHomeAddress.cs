using System;

namespace BelanjaYuk.Domain.Entities;

public class TrHomeAddress
{
    public string IdHomeAddress { get; set; } = Guid.NewGuid().ToString();
    public string IdUser { get; set; } = string.Empty;
    public MsUser? User { get; set; }
    public string Provinsi { get; set; } = string.Empty;
    public string KotaKabupaten { get; set; } = string.Empty;
    public string Kecamatan { get; set; } = string.Empty;
    public string KodePos { get; set; } = string.Empty;
    public string HomeAddressDesc { get; set; } = string.Empty;
    public bool IsPrimaryAddress { get; set; } = true;

    public DateTime DateIn { get; set; } = DateTime.UtcNow;
    public string UserIn { get; set; } = "System";
    public DateTime? DateUp { get; set; }
    public string? UserUp { get; set; }
    public bool IsActive { get; set; } = true;
}
