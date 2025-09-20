using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ShipnetFunctionApp.Data.Models.Charterering;

namespace ShipnetFunctionApp.Data.Configurations
{
    public class VoyageHeaderConfiguration : IEntityTypeConfiguration<VoyageHeader>
    {
        public void Configure(EntityTypeBuilder<VoyageHeader> builder)
        {
            builder.ToTable("voyageheaders");

            builder.HasKey(e => e.Id);
            builder.Property(e => e.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            builder.Property(e => e.VesselId)
                .HasColumnName("vesselid")
                .IsRequired();

            builder.Property(e => e.VoyageNo)
                .HasColumnName("voyageno")
                .HasMaxLength(50)
                .IsRequired();

            builder.Property(e => e.VoyageTypeId)
                .HasColumnName("voyagetypeid");

            builder.Property(e => e.EstimateId)
                .HasColumnName("estimateid");

            builder.Property(e => e.Status)
                .HasColumnName("status")
                .HasMaxLength(50);

            builder.Property(e => e.VoyageStartDate)
               .HasColumnName("voyagestartdate")
                .HasColumnType("timestamp without time zone");

            builder.Property(e => e.VoyageEndDate)
               .HasColumnName("voyageenddate")
                .HasColumnType("timestamp without time zone");

            builder.Property(e => e.AdditionalData)
               .HasColumnName("additionaldata");

            builder.Property(e => e.CreatedBy)
               .HasColumnName("createdby");

            builder.Property(e => e.UpdatedBy)
               .HasColumnName("updatedby");

            builder.Property(e => e.CreatedAt)
               .HasColumnName("createdat")
                .HasColumnType("timestamp without time zone");

            builder.Property(e => e.UpdatedAt)
               .HasColumnName("updatedat")
                .HasColumnType("timestamp without time zone");
        }
    }
}
