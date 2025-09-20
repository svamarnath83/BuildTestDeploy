using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ShipnetFunctionApp.Data.Models;

namespace ShipnetFunctionApp.Data.Configurations
{
    public class PortConfiguration : IEntityTypeConfiguration<Port>
    {
        public void Configure(EntityTypeBuilder<Port> entity)
        {
            entity.ToTable("ports");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd(); // use provider default identity

            entity.Property(e => e.PortCode)
                .HasColumnName("portcode")
                .HasMaxLength(50);

            entity.Property(e => e.Name)
                .HasColumnName("name")
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Unctad)
                .HasColumnName("unctad")
                .HasMaxLength(50);

            entity.Property(e => e.netpasCode)
                .HasColumnName("netpascode")
                .HasMaxLength(50);

            entity.Property(e => e.ets)
                .HasColumnName("ets")
                .HasMaxLength(50);

            entity.Property(e => e.Ishistorical)
                .HasColumnName("ishistorical");

            entity.Property(e => e.IsActive)
                .HasColumnName("isactive")
                .IsRequired();

            entity.Property(e => e.additionaldata)
               .HasColumnName("additionaldata");

            entity.Property(e => e.rankOrder)
               .HasColumnName("rankorder");
        }
    }
}