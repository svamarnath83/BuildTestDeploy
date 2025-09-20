using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ShipnetFunctionApp.Data.Models;
using static Grpc.Core.Metadata;

namespace ShipnetFunctionApp.Data.Configurations
{
    public class GradeConfiguration : IEntityTypeConfiguration<Grade>
    {
        public void Configure(EntityTypeBuilder<Grade> builder)
        {
            builder.ToTable("grades");

            builder.HasKey(g => g.Id);
            builder.Property(g => g.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            builder.Property(g => g.Name).HasColumnName("name")
                .IsRequired()
                .HasMaxLength(100);

            builder.HasIndex(g => g.Name)
                .IsUnique();

            builder.Property(g => g.Price).HasColumnName("price")
                .HasColumnType("decimal(10,2)")
                .IsRequired();

            builder.Property(g => g.InUse).HasColumnName("inuse")
                .HasDefaultValue(false);

            builder.Property(g => g.CreatedAt).HasColumnName("createdat").HasColumnType("timestamp without time zone");

            builder.Property(g => g.UpdatedAt).HasColumnName("updatedat").HasColumnType("timestamp without time zone");
        }
    }
}