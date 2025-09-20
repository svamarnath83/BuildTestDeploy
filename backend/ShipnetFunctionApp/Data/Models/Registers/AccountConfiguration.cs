using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ShipnetFunctionApp.Data.Models.Registers
{
    public class AccountConfiguration : IEntityTypeConfiguration<Account>
    {
        public void Configure(EntityTypeBuilder<Account> builder)
        {
            builder.ToTable("accounts");

            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).HasColumnName("id").ValueGeneratedOnAdd();

            builder.Property(x => x.AccountNumber).HasColumnName("account_number").HasMaxLength(20).IsRequired();
            builder.Property(x => x.AccountName).HasColumnName("account_name").HasMaxLength(100).IsRequired();
            builder.Property(x => x.ExternalAccountNumber).HasColumnName("external_account_number").HasMaxLength(50);
            builder.Property(x => x.LedgerType).HasColumnName("ledger_type").HasMaxLength(20);
            builder.Property(x => x.Dimension).HasColumnName("dimension").HasMaxLength(50);
            builder.Property(x => x.Currency).HasColumnName("currency").HasMaxLength(10);
            builder.Property(x => x.CurrencyCode).HasColumnName("currency_code").HasMaxLength(10);
            builder.Property(x => x.Status).HasColumnName("status").HasMaxLength(10).HasDefaultValue("Free");
            builder.Property(x => x.Type).HasColumnName("type").HasMaxLength(20);
            builder.Property(x => x.AccountGroupId).HasColumnName("account_group_id");

            // Unique constraint on account_number
            builder.HasIndex(x => x.AccountNumber).IsUnique();

            // Foreign key relationship with AccountGroup
            builder.HasOne(x => x.AccountGroup)
                   .WithMany()
                   .HasForeignKey(x => x.AccountGroupId)
                   .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
