using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ShipnetFunctionApp.Data.Models;

namespace ShipnetFunctionApp.Data.Configurations
{
    public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
    {
        public void Configure(EntityTypeBuilder<AuditLog> entity)
        {
            entity.ToTable("auditlogs");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            entity.Property(e => e.TableName)
                .HasColumnName("tablename")
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(e => e.Action)
                .HasColumnName("action")
                .IsRequired();

            entity.Property(e => e.KeyValues)
                .HasColumnName("keyvalues");

            entity.Property(e => e.Changes)
                .HasColumnName("changes");

            entity.Property(e => e.UserName)
                .HasColumnName("username")
                .HasMaxLength(200);

            entity.Property(e => e.ChangedAt)
                .HasColumnName("changedat")
                .HasColumnType("timestamp without time zone");

            entity.HasIndex(e => new { e.TableName, e.KeyValues })
                .HasDatabaseName("ix_audit_logs_table_key");
        }
    }
}
