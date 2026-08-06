using BelanjaYuk.Application.Interfaces;
using BelanjaYuk.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BelanjaYuk.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<LtGender> LtGenders => Set<LtGender>();
    public DbSet<LtCategory> LtCategories => Set<LtCategory>();
    public DbSet<LtPayment> LtPayments => Set<LtPayment>();
    public DbSet<MsUser> MsUsers => Set<MsUser>();
    public DbSet<MsUserPassword> MsUserPasswords => Set<MsUserPassword>();
    public DbSet<MsUserSeller> MsUserSellers => Set<MsUserSeller>();
    public DbSet<MsProduct> MsProducts => Set<MsProduct>();
    public DbSet<TrProductImages> TrProductImages => Set<TrProductImages>();
    public DbSet<TrHomeAddress> TrHomeAddresses => Set<TrHomeAddress>();
    public DbSet<TrBuyerCart> TrBuyerCarts => Set<TrBuyerCart>();
    public DbSet<TrBuyerTransaction> TrBuyerTransactions => Set<TrBuyerTransaction>();
    public DbSet<TrBuyerTransactionDetail> TrBuyerTransactionDetails => Set<TrBuyerTransactionDetail>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // LtGender
        modelBuilder.Entity<LtGender>(entity =>
        {
            entity.ToTable("LtGender");
            entity.HasKey(e => e.IdGender);
            entity.Property(e => e.GenderName).HasMaxLength(50).IsRequired();
        });

        // LtCategory
        modelBuilder.Entity<LtCategory>(entity =>
        {
            entity.ToTable("LtCategory");
            entity.HasKey(e => e.IdCategory);
            entity.Property(e => e.CategoryName).HasMaxLength(100).IsRequired();
        });

        // LtPayment
        modelBuilder.Entity<LtPayment>(entity =>
        {
            entity.ToTable("LtPayment");
            entity.HasKey(e => e.IdPayment);
            entity.Property(e => e.PaymentName).HasMaxLength(100).IsRequired();
        });

        // MsUser
        modelBuilder.Entity<MsUser>(entity =>
        {
            entity.ToTable("MsUser");
            entity.HasKey(e => e.IdUser);
            entity.Property(e => e.UserName).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Email).HasMaxLength(100).IsRequired();
            entity.Property(e => e.PhoneNumber).HasMaxLength(50).IsRequired();
            entity.HasOne(e => e.Gender)
                  .WithMany()
                  .HasForeignKey(e => e.IdGender)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // MsUserPassword (1-to-1 with MsUser)
        modelBuilder.Entity<MsUserPassword>(entity =>
        {
            entity.ToTable("MsUserPassword");
            entity.HasKey(e => e.IdUserPassword);
            entity.HasOne(e => e.User)
                  .WithOne(u => u.UserPassword)
                  .HasForeignKey<MsUserPassword>(e => e.IdUser)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // MsUserSeller
        modelBuilder.Entity<MsUserSeller>(entity =>
        {
            entity.ToTable("MsUserSeller");
            entity.HasKey(e => e.IdUserSeller);
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.IdUser)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // MsProduct
        modelBuilder.Entity<MsProduct>(entity =>
        {
            entity.ToTable("MsProduct");
            entity.HasKey(e => e.IdProduct);
            entity.Property(e => e.Price).HasPrecision(18, 2);
            entity.Property(e => e.DiscountProduct).HasPrecision(18, 2);
            entity.HasOne(e => e.Category)
                  .WithMany()
                  .HasForeignKey(e => e.IdCategory)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Seller)
                  .WithMany()
                  .HasForeignKey(e => e.IdUserSeller)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // TrProductImages
        modelBuilder.Entity<TrProductImages>(entity =>
        {
            entity.ToTable("TrProductImages");
            entity.HasKey(e => e.IdProductImages);
            entity.HasOne(e => e.Product)
                  .WithMany(p => p.Images)
                  .HasForeignKey(e => e.IdProduct)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // TrHomeAddress
        modelBuilder.Entity<TrHomeAddress>(entity =>
        {
            entity.ToTable("TrHomeAddress");
            entity.HasKey(e => e.IdHomeAddress);
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.IdUser)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // TrBuyerCart
        modelBuilder.Entity<TrBuyerCart>(entity =>
        {
            entity.ToTable("TrBuyerCart");
            entity.HasKey(e => e.IdBuyerCart);
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.IdUser)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Product)
                  .WithMany()
                  .HasForeignKey(e => e.IdProduct)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // TrBuyerTransaction
        modelBuilder.Entity<TrBuyerTransaction>(entity =>
        {
            entity.ToTable("TrBuyerTransaction");
            entity.HasKey(e => e.IdBuyerTransaction);
            entity.Property(e => e.FinalPrice).HasPrecision(18, 2);
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.IdUser)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Payment)
                  .WithMany()
                  .HasForeignKey(e => e.IdPayment)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // TrBuyerTransactionDetail
        modelBuilder.Entity<TrBuyerTransactionDetail>(entity =>
        {
            entity.ToTable("TrBuyerTransactionDetail");
            entity.HasKey(e => e.IdBuyerTransactionDetail);
            entity.Property(e => e.PriceProduct).HasPrecision(18, 2);
            entity.Property(e => e.DiscountProduct).HasPrecision(18, 2);
            entity.HasOne(e => e.Transaction)
                  .WithMany(t => t.Details)
                  .HasForeignKey(e => e.IdBuyerTransaction)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Product)
                  .WithMany()
                  .HasForeignKey(e => e.IdProduct)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
