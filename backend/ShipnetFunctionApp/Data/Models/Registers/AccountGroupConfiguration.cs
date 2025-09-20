using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ShipnetFunctionApp.Data.Models.Registers
{
    public class AccountGroupConfiguration : IEntityTypeConfiguration<AccountGroup>
    {
        public void Configure(EntityTypeBuilder<AccountGroup> builder)
        {
            builder.ToTable("account_groups");

            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).HasColumnName("id").ValueGeneratedOnAdd();

            builder.Property(x => x.Level1Name).HasColumnName("level1_name").HasMaxLength(50);
            builder.Property(x => x.Level1Code).HasColumnName("level1_code").HasMaxLength(10);
            builder.Property(x => x.Level2Name).HasColumnName("level2_name").HasMaxLength(50);
            builder.Property(x => x.Level2Code).HasColumnName("level2_code").HasMaxLength(10);
            builder.Property(x => x.Level3Name).HasColumnName("level3_name").HasMaxLength(50);
            builder.Property(x => x.Level3Code).HasColumnName("level3_code").HasMaxLength(10);
            builder.Property(x => x.GroupCode).HasColumnName("group_code").HasMaxLength(10);
            builder.Property(x => x.Description).HasColumnName("description").HasMaxLength(100);
            builder.Property(x => x.IfrsReference).HasColumnName("ifrs_reference").HasMaxLength(50);
            builder.Property(x => x.SaftCode).HasColumnName("saft_code").HasMaxLength(50);

            // Unique constraint on group_code
            builder.HasIndex(x => x.GroupCode).IsUnique();
        }
    }
}