using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ShipnetFunctionApp.Data.Models.Charterering;

namespace ShipnetFunctionApp.Data.Configurations
{
    /// <summary>
    /// Entity Framework configuration for VoyagePortrotation
    /// </summary>
    public class VoyagePortRotationConfiguration : IEntityTypeConfiguration<VoyagePortRotation>
    {
        public void Configure(EntityTypeBuilder<VoyagePortRotation> entity)
        {
            entity.ToTable("voyageportrotations");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            entity.Property(e => e.PortId)
                .HasColumnName("portid");

            entity.Property(e => e.ArrivalDate)
                .HasColumnName("arrivaldate")
                .HasColumnType("timestamp without time zone");

            entity.Property(e => e.DepartureDate)
                .HasColumnName("departuredate")
                .HasColumnType("timestamp without time zone");

            entity.Property(e => e.PortCost)
                .HasColumnName("portcost")
                .HasColumnType("numeric(18,2)");

            entity.Property(e => e.CargoCost)
                .HasColumnName("cargocost")
                .HasColumnType("numeric(18,2)");

            entity.Property(e => e.AgentId)
                .HasColumnName("agentid");

            entity.Property(e => e.PortTypeId)
                .HasColumnName("porttypeid");

            entity.Property(e => e.TimeOfBert)
                .HasColumnName("timeofbert")
                .HasColumnType("numeric(10,2)");

            entity.Property(e => e.Distance)
                .HasColumnName("distance")
                .HasColumnType("numeric(10,2)");

            entity.Property(e => e.VoyageId)
                .HasColumnName("voyageid");

            entity.Property(e => e.SequenceOrder)
                .HasColumnName("sequenceorder");

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
                .HasDatabaseName("IX_voyageportrotations_voyageid");

            entity.HasIndex(e => e.PortId)
                .HasDatabaseName("IX_voyageportrotations_portid");

            entity.HasIndex(e => e.IsActive)
                .HasDatabaseName("IX_voyageportrotations_isactive");

            entity.HasIndex(e => new { e.VoyageId, e.SequenceOrder })
                .HasDatabaseName("IX_voyageportrotations_voyage_sequence");
        }
    }
}