using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BelanjaYuk.Application.Interfaces;
using BelanjaYuk.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BelanjaYuk.Infrastructure.Persistence;

public static class DbInitializer
{
    public static async Task SeedAsync(ApplicationDbContext context, IPasswordHasher passwordHasher, ILogger logger)
    {
        try
        {
            await context.Database.EnsureCreatedAsync();

            // 1. Seed LtGender
            if (!await context.LtGenders.AnyAsync())
            {
                logger.LogInformation("Seeding LtGender...");
                await context.LtGenders.AddRangeAsync(new[]
                {
                    new LtGender { IdGender = "g-male-1111-1111-111111111111", GenderName = "Laki-laki" },
                    new LtGender { IdGender = "g-female-2222-2222-222222222222", GenderName = "Perempuan" }
                });
            }

            // 2. Seed LtCategory (Matching Mockup Categories: Elektronik, Fashion, Rumah Tangga, Olahraga, Makanan)
            if (!await context.LtCategories.AnyAsync())
            {
                logger.LogInformation("Seeding LtCategory...");
                await context.LtCategories.AddRangeAsync(new[]
                {
                    new LtCategory { IdCategory = "cat-elektronik-1111", CategoryName = "Elektronik" },
                    new LtCategory { IdCategory = "cat-fashion-2222", CategoryName = "Fashion" },
                    new LtCategory { IdCategory = "cat-rumahtangga-3333", CategoryName = "Rumah Tangga" },
                    new LtCategory { IdCategory = "cat-olahraga-4444", CategoryName = "Olahraga" },
                    new LtCategory { IdCategory = "cat-makanan-5555", CategoryName = "Makanan" }
                });
            }

            // 3. Seed LtPayment
            if (!await context.LtPayments.AnyAsync())
            {
                logger.LogInformation("Seeding LtPayment...");
                await context.LtPayments.AddRangeAsync(new[]
                {
                    new LtPayment { IdPayment = "pay-transfer-1111", PaymentName = "Transfer Bank" },
                    new LtPayment { IdPayment = "pay-cod-2222", PaymentName = "Cash On Delivery (COD)" }
                });
            }

            await context.SaveChangesAsync();

            // 4. Seed MsUser & MsUserPassword (Andi Kusuma & Stephanie Halim)
            if (!await context.MsUsers.AnyAsync())
            {
                logger.LogInformation("Seeding MsUser & MsUserPassword...");
                var hashedPassword = passwordHasher.HashPassword("Password123!");

                var user1 = new MsUser
                {
                    IdUser = "usr-andi-1111",
                    UserName = "andi_kusuma",
                    Email = "buyer@belanjayuk.com",
                    PhoneNumber = "081234567890",
                    FirstName = "Andi",
                    LastName = "Kusuma",
                    IdGender = "g-male-1111-1111-111111111111"
                };

                var user2 = new MsUser
                {
                    IdUser = "usr-steph-2222",
                    UserName = "stephanie",
                    Email = "stephanie@belanjayuk.com",
                    PhoneNumber = "089876543210",
                    FirstName = "Stephanie",
                    LastName = "Halim",
                    IdGender = "g-female-2222-2222-222222222222"
                };

                await context.MsUsers.AddRangeAsync(user1, user2);

                await context.MsUserPasswords.AddRangeAsync(new[]
                {
                    new MsUserPassword { IdUserPassword = "pwd-andi-1111", IdUser = user1.IdUser, PasswordHash = hashedPassword },
                    new MsUserPassword { IdUserPassword = "pwd-steph-2222", IdUser = user2.IdUser, PasswordHash = hashedPassword }
                });
            }

            // 5. Seed MsUserSeller
            if (!await context.MsUserSellers.AnyAsync())
            {
                logger.LogInformation("Seeding MsUserSeller...");
                await context.MsUserSellers.AddAsync(new MsUserSeller
                {
                    IdUserSeller = "sel-official-1111",
                    IdUser = "usr-andi-1111",
                    SellerName = "BelanjaYuk Official Store",
                    SellerDesc = "Toko Resmi BelanjaYuk Indonesia",
                    Address = "Jakarta Pusat",
                    SellerCode = "BY-OFFICIAL",
                    PhoneNumber = "081234567890"
                });
            }

            await context.SaveChangesAsync();

            // 6. Seed MsProduct & TrProductImages (Matching Mockup Beranda)
            if (!await context.MsProducts.AnyAsync())
            {
                logger.LogInformation("Seeding MsProduct & TrProductImages...");
                var products = new List<MsProduct>
                {
                    new MsProduct { IdProduct = "prd-01", IdUserSeller = "sel-official-1111", ProductName = "Headset Bluetooth ZX", ProductDesc = "Headset bluetooth wireless audio bass jernih dengan noise reduction.", IdCategory = "cat-elektronik-1111", Price = 289000m, DiscountProduct = 0m, Qty = 100 },
                    new MsProduct { IdProduct = "prd-02", IdUserSeller = "sel-official-1111", ProductName = "Kemeja Linen Basic", ProductDesc = "Kemeja berbahan linen kasual adem cocok untuk kerja dan hangout.", IdCategory = "cat-fashion-2222", Price = 159000m, DiscountProduct = 0m, Qty = 80 },
                    new MsProduct { IdProduct = "prd-03", IdUserSeller = "sel-official-1111", ProductName = "Botol Tumbler 1L", ProductDesc = "Tumbler stainless steel tahan panas dan dingin hingga 24 jam.", IdCategory = "cat-rumahtangga-3333", Price = 99000m, DiscountProduct = 0m, Qty = 200 },
                    new MsProduct { IdProduct = "prd-04", IdUserSeller = "sel-official-1111", ProductName = "Sepatu Lari LiteRun", ProductDesc = "Sepatu lari sol empuk dan ringan untuk kenyamanan olahraga sehari-hari.", IdCategory = "cat-olahraga-4444", Price = 399000m, DiscountProduct = 0m, Qty = 50 },
                    new MsProduct { IdProduct = "prd-05", IdUserSeller = "sel-official-1111", ProductName = "Kopi Arabika 200g", ProductDesc = "Biji kopi arabika segar pilihan dengan aroma kaya dan harum.", IdCategory = "cat-makanan-5555", Price = 69000m, DiscountProduct = 0m, Qty = 150 },
                    new MsProduct { IdProduct = "prd-06", IdUserSeller = "sel-official-1111", ProductName = "Keyboard Mekanik 60%", ProductDesc = "Keyboard mekanikal compact RGB dengan switch tactile responsif.", IdCategory = "cat-elektronik-1111", Price = 499000m, DiscountProduct = 0m, Qty = 60 },
                    new MsProduct { IdProduct = "prd-07", IdUserSeller = "sel-official-1111", ProductName = "Jaket Windbreaker", ProductDesc = "Jaket outdoor anti angin dan tahan gerimis ringan.", IdCategory = "cat-fashion-2222", Price = 279000m, DiscountProduct = 0m, Qty = 40 },
                    new MsProduct { IdProduct = "prd-08", IdUserSeller = "sel-official-1111", ProductName = "Set Panci 3in1", ProductDesc = "Set peralatan masak anti lengket dilapisi bahan granit lapis 5.", IdCategory = "cat-rumahtangga-3333", Price = 359000m, DiscountProduct = 0m, Qty = 33 },
                    new MsProduct { IdProduct = "prd-09", IdUserSeller = "sel-official-1111", ProductName = "Dumbbell 5kg", ProductDesc = "Dumbbell karet sintetis anti slip nyaman untuk latihan fisik.", IdCategory = "cat-olahraga-4444", Price = 149000m, DiscountProduct = 0m, Qty = 120 },
                    new MsProduct { IdProduct = "prd-10", IdUserSeller = "sel-official-1111", ProductName = "Mi Instan Premium", ProductDesc = "Paket isi 5 mi instan kuah ramen cita rasa rempah otentik.", IdCategory = "cat-makanan-5555", Price = 19900m, DiscountProduct = 0m, Qty = 420 }
                };

                await context.MsProducts.AddRangeAsync(products);

                await context.TrProductImages.AddRangeAsync(new[]
                {
                    new TrProductImages { IdProductImages = "img-01", IdProduct = "prd-01", ProductImage = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80" },
                    new TrProductImages { IdProductImages = "img-02", IdProduct = "prd-02", ProductImage = "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80" },
                    new TrProductImages { IdProductImages = "img-03", IdProduct = "prd-03", ProductImage = "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80" },
                    new TrProductImages { IdProductImages = "img-04", IdProduct = "prd-04", ProductImage = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80" },
                    new TrProductImages { IdProductImages = "img-05", IdProduct = "prd-05", ProductImage = "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80" },
                    new TrProductImages { IdProductImages = "img-06", IdProduct = "prd-06", ProductImage = "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80" },
                    new TrProductImages { IdProductImages = "img-07", IdProduct = "prd-07", ProductImage = "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80" },
                    new TrProductImages { IdProductImages = "img-08", IdProduct = "prd-08", ProductImage = "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80" },
                    new TrProductImages { IdProductImages = "img-09", IdProduct = "prd-09", ProductImage = "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80" },
                    new TrProductImages { IdProductImages = "img-10", IdProduct = "prd-10", ProductImage = "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80" }
                });
            }

            await context.SaveChangesAsync();
            logger.LogInformation("Database seed completed successfully.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error while seeding database.");
            throw;
        }
    }
}
