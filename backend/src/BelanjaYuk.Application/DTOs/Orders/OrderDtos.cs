using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BelanjaYuk.Application.DTOs.Orders;

public class PaymentMethodDto
{
    public string IdPayment { get; set; } = string.Empty;
    public string PaymentName { get; set; } = string.Empty;
}

public class CheckoutRequest
{
    [Required]
    public string IdPayment { get; set; } = string.Empty;
}

public class TransactionDetailDto
{
    public string IdBuyerTransactionDetail { get; set; } = string.Empty;
    public string IdProduct { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public decimal PriceProduct { get; set; } // Original price
    public decimal DiscountProduct { get; set; } // Discount amount
    public decimal UnitPrice => PriceProduct - DiscountProduct; // Price after discount
    public int Qty { get; set; }
    public decimal TotalPrice => UnitPrice * Qty;
}

public class TransactionDto
{
    public string IdBuyerTransaction { get; set; } = string.Empty;
    public string PaymentName { get; set; } = string.Empty;
    public decimal TotalOriginalAmount { get; set; }
    public decimal TotalDiscountAmount { get; set; }
    public decimal FinalPrice { get; set; }
    public DateTime DateIn { get; set; }
    public List<TransactionDetailDto> Details { get; set; } = new();
}
