using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ShipnetFunctionApp.Data.Models;

namespace ShipnetFunctionApp.Data.Configurations
{
    public class VesselGradeConfiguration : IEntityTypeConfiguration<VesselGrade>
    {
        public void Configure(EntityTypeBuilder<VesselGrade> entity)
        {
            entity.ToTable("vesselgrades");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            entity.Property(e => e.vesselId)
                .HasColumnName("vesselid")
                .IsRequired();

            entity.Property(e => e.GradeId)
                .HasColumnName("gradeid")
                .IsRequired();

            entity.Property(e => e.UomId)
                .HasColumnName("uomid")
                .IsRequired();

            entity.Property(e => e.Type)
                .HasColumnName("type")
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(e => e.GradeName)
                .HasColumnName("gradename");

            entity.Property(e => e.SortOrder)
               .HasColumnName("sortorder");
        }
    }
}