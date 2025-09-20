using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ShipnetFunctionApp.Data.Models;

namespace ShipnetFunctionApp.Data.Configurations
{
    public class VesselConfiguration : IEntityTypeConfiguration<Vessels>
    {
        public void Configure(EntityTypeBuilder<Vessels> entity)
        {
            entity.ToTable("vessels");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            entity.Property(e => e.Name)
                .HasColumnName("name")
                .HasMaxLength(255);

            entity.Property(e => e.Code)
                .HasColumnName("code")
                .HasMaxLength(100);

            entity.Property(e => e.IMO)
                .HasColumnName("imo")
                .HasMaxLength(50);

            entity.Property(e => e.Dwt)
                .HasColumnName("dwt")
                .HasMaxLength(50);

            entity.Property(e => e.Type)
                .HasColumnName("type")
                .HasMaxLength(100);

            entity.Property(e => e.Latitude)
                .HasMaxLength(60)
                .HasColumnName("latitude");

            entity.Property(e => e.Longitude)
                .HasMaxLength(60)
                .HasColumnName("longitude");

            entity.Property(e => e.RunningCost)
                .HasColumnName("runningcost")
                .HasMaxLength(100);

            entity.Property(e => e.vesseljson)
                .HasColumnName("vesseljson")
                .HasColumnType("text");
        }
    }
}