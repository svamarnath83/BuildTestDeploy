using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ShipnetFunctionApp.Data.Models;

namespace ShipnetFunctionApp.Data.Configurations
{
    public class ActivityLogConfiguration : IEntityTypeConfiguration<ActivityLog>
    {
        public void Configure(EntityTypeBuilder<ActivityLog> entity)
        {
            entity.ToTable("activitylog");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            entity.Property(e => e.ModuleId)
                .HasColumnName("moduleid")
                .IsRequired();

            entity.Property(e => e.RecordId)
                .HasColumnName("recordid")
                .IsRequired();

            entity.Property(e => e.ActivityName)
                .HasColumnName("activityname")
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(e => e.AssignedTo)
                .HasColumnName("assignedto");

            entity.Property(e => e.Status)
                .HasColumnName("status")
                .HasMaxLength(100);

            entity.Property(e => e.DueDate)
                .HasColumnName("duedate")
                .HasColumnType("timestamp without time zone");

            entity.Property(e => e.CreatedBy)
                .HasColumnName("createdby");

            entity.Property(e => e.CreatedDate)
                .HasColumnName("createddate")
                .HasColumnType("timestamp without time zone");

            entity.Property(e => e.AdditionalData)
                .HasColumnName("additionaldata");

            entity.Property(e => e.Notes)
                .HasColumnName("notes");

            entity.Property(e => e.Summary)
                .HasColumnName("summary");

            entity.Property(e => e.ParentId)
               .HasColumnName("parentid");

            entity.Property(e => e.ActivityImpactData)
               .HasColumnName("activityimpactdata");
        }
    }
}
