using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ShipnetFunctionApp.Data.Models.Operation;

namespace ShipnetFunctionApp.Data.Configurations
{
    /// <summary>
    /// Entity Framework configuration for Voyagecargo
    /// </summary>
    public class VoyageCargoConfiguration : IEntityTypeConfiguration<VoyageCargo>
    {
        public void Configure(EntityTypeBuilder<VoyageCargo> entity)
        {
            entity.ToTable("voyagecargos");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            entity.Property(e => e.VoyageId)
                .HasColumnName("voyageid");

            entity.Property(e => e.ChartererId)
                .HasColumnName("chartererid");

            entity.Property(e => e.CommodityId)
                .HasColumnName("commodityid");

            entity.Property(e => e.Rate)
                .HasColumnName("rate")
                .HasColumnType("numeric(18,4)");

            entity.Property(e => e.RateTypeId)
                .HasColumnName("ratetypeid");

            entity.Property(e => e.Qty)
                .HasColumnName("qty")
                .HasColumnType("numeric(18,3)");

            entity.Property(e => e.UomId)
                .HasColumnName("uomid");

            entity.Property(e => e.LoadPorts)
                .HasColumnName("loadports")
                .HasMaxLength(1000);

            entity.Property(e => e.DischargePorts)
                .HasColumnName("dischargeports")
                .HasMaxLength(1000);

            entity.Property(e => e.CargoDescription)
                .HasColumnName("cargodescription")
                .HasMaxLength(500);

            entity.Property(e => e.LaycanStart)
                .HasColumnName("laycanstart")
                .HasColumnType("timestamp without time zone");

            entity.Property(e => e.LaycanEnd)
                .HasColumnName("laycanend")
                .HasColumnType("timestamp without time zone");

            entity.Property(e => e.CommissionRate)
                .HasColumnName("commissionrate")
                .HasColumnType("numeric(5,2)");

            entity.Property(e => e.Terms)
                .HasColumnName("terms")
                .HasColumnType("text");

            entity.Property(e => e.Notes)
                .HasColumnName("notes")
                .HasColumnType("text");

            entity.Property(e => e.IsActive)
                .HasColumnName("isactive")
                .IsRequired()
                .HasDefaultValue(true);

            entity.Property(e => e.CreatedBy)
                .HasColumnName("createdby");

            entity.Property(e => e.UpdatedBy)
                .HasColumnName("updatedby");

            entity.Property(e => e.CreatedAt)
                .HasColumnName("createdat")
                .HasColumnType("timestamp without time zone");

            entity.Property(e => e.UpdatedAt)
                .HasColumnName("updatedat")
                .HasColumnType("timestamp without time zone");

            // Add indexes for performance
            entity.HasIndex(e => e.VoyageId)
                .HasDatabaseName("IX_voyagecargos_voyageid");

            entity.HasIndex(e => e.ChartererId)
                .HasDatabaseName("IX_voyagecargos_chartererid");

            entity.HasIndex(e => e.CommodityId)
                .HasDatabaseName("IX_voyagecargos_commodityid");

            entity.HasIndex(e => e.IsActive)
                .HasDatabaseName("IX_voyagecargos_isactive");
        }
    }
}