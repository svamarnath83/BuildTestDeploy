using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ShipnetFunctionApp.Data.Models;

namespace ShipnetFunctionApp.Data.Configurations
{
    public class DistanceSourceConfiguration : IEntityTypeConfiguration<DistanceSource>
    {
        public void Configure(EntityTypeBuilder<DistanceSource> builder)
        {
            builder.ToTable("sndistance");
            builder.HasKey(ds => ds.Id);
            builder.Property(g => g.Id).HasColumnName("id").ValueGeneratedOnAdd();
            builder.Property(ds => ds.FromPort).HasColumnName("fromport").IsRequired().HasMaxLength(100);
            builder.Property(ds => ds.ToPort).HasColumnName("toport").IsRequired().HasMaxLength(100);
            builder.Property(ds => ds.Distance).HasColumnName("distance");
            builder.Property(ds => ds.xmldata).HasColumnName("xmldata");

        }
    }
}
