using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ShipnetFunctionApp.Data.Models;

namespace ShipnetFunctionApp.Data.Configurations
{
    public class EstimateConfiguration : IEntityTypeConfiguration<Estimate>
    {
        public void Configure(EntityTypeBuilder<Estimate> builder)
        {
            builder.ToTable("estimates");
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();
            builder.Property(e => e.EstimateNo).HasColumnName("estimateno").IsRequired().HasMaxLength(50);
            builder.Property(e => e.EstimateDate).HasColumnName("estimatedate").HasColumnType("timestamp without time zone").IsRequired();
            builder.Property(e => e.ShipType).HasColumnName("shiptype").IsRequired().HasMaxLength(20);
            builder.Property(e => e.Ship).HasColumnName("ship").IsRequired().HasMaxLength(100);
            builder.Property(e => e.Commodity).HasColumnName("commodity").IsRequired().HasMaxLength(100);
            builder.Property(e => e.LoadPorts).HasColumnName("loadports").IsRequired().HasMaxLength(200);
            builder.Property(e => e.DischargePorts).HasColumnName("dischargeports").IsRequired().HasMaxLength(200);
            builder.Property(e => e.Status).HasColumnName("status").IsRequired().HasMaxLength(10);
            builder.Property(e => e.VoyageNo).HasColumnName("voyageno").IsRequired().HasMaxLength(50);
            builder.Property(e => e.ShipAnalysis).HasColumnName("shipanalysis").HasColumnType("text");
        }
    }
}