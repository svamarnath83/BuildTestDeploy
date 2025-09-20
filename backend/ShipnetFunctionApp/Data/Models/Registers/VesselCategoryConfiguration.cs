using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ShipnetFunctionApp.Data.Models;

namespace ShipnetFunctionApp.Data.Configurations
{
    public class VesselCategoryConfiguration : IEntityTypeConfiguration<VesselCategory>
    {
        public void Configure(EntityTypeBuilder<VesselCategory> entity)
        {
            entity.ToTable("vesselcategories");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            entity.Property(e => e.Name)
                .HasColumnName("name")
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.IsActive)
                .HasColumnName("isactive")
                .IsRequired();

            entity.Property(e => e.CreatedBy)
                .HasColumnName("createdby");

            entity.Property(e => e.UpdatedBy)
                .HasColumnName("updatedby");

            entity.Property(e => e.CreatedAt).HasColumnType("timestamp without time zone")
                .HasColumnName("createdate");

            entity.Property(e => e.UpdatedAt).HasColumnType("timestamp without time zone")
                .HasColumnName("updatedate");
        }
    }
}