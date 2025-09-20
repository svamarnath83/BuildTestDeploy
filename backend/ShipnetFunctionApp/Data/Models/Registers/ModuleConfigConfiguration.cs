using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ShipnetFunctionApp.Data.Models;

namespace ShipnetFunctionApp.Data.Configurations
{
    public class ModuleConfigConfiguration : IEntityTypeConfiguration<ModuleConfig>
    {
        public void Configure(EntityTypeBuilder<ModuleConfig> entity)
        {
            entity.ToTable("moduleconfig");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            entity.Property(e => e.ModuleId)
                .HasColumnName("moduleid")
                .IsRequired();

            entity.Property(e => e.TableName)
                .HasColumnName("tablename")
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(e => e.IsActive)
                .HasColumnName("isactive")
                .HasDefaultValue(true);

            entity.HasIndex(e => e.ModuleId)
                .IsUnique()
                .HasDatabaseName("ux_module_config_moduleid");

            entity.HasIndex(e => e.TableName)
                .HasDatabaseName("ix_module_config_tablename");

            // Seed initial mappings: 1=estimates, 2=ports
            entity.HasData(
                new ModuleConfig { Id = 1, ModuleId = 1, TableName = "estimates", IsActive = true },
                new ModuleConfig { Id = 2, ModuleId = 2, TableName = "ports", IsActive = true }
            );
        }
    }
}
