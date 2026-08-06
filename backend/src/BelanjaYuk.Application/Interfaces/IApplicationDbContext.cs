using BelanjaYuk.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace BelanjaYuk.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<LtGender> LtGenders { get; }
    DbSet<LtCategory> LtCategories { get; }
    DbSet<LtPayment> LtPayments { get; }
    DbSet<MsUser> MsUsers { get; }
    DbSet<MsUserPassword> MsUserPasswords { get; }
    DbSet<MsUserSeller> MsUserSellers { get; }
    DbSet<MsProduct> MsProducts { get; }
    DbSet<TrProductImages> TrProductImages { get; }
    DbSet<TrHomeAddress> TrHomeAddresses { get; }
    DbSet<TrBuyerCart> TrBuyerCarts { get; }
    DbSet<TrBuyerTransaction> TrBuyerTransactions { get; }
    DbSet<TrBuyerTransactionDetail> TrBuyerTransactionDetails { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
