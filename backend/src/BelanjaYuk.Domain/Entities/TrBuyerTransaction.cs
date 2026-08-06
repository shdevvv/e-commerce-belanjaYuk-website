using System;
using System.Collections.Generic;

namespace BelanjaYuk.Domain.Entities;

public class TrBuyerTransaction
{
    public string IdBuyerTransaction { get; set; } = Guid.NewGuid().ToString();
    public string IdUser { get; set; } = string.Empty;
    public MsUser? User { get; set; }
    public string IdPayment { get; set; } = string.Empty;
    public LtPayment? Payment { get; set; }
    public decimal FinalPrice { get; set; }
    public int? Rating { get; set; }
    public string? RatingComment { get; set; }

    public DateTime DateIn { get; set; } = DateTime.UtcNow;
    public string UserIn { get; set; } = "System";
    public DateTime? DateUp { get; set; }
    public string? UserUp { get; set; }
    public bool IsActive { get; set; } = true;

    public List<TrBuyerTransactionDetail> Details { get; set; } = new();
}
