using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ShipnetFunctionApp.Data.Models;

namespace ShipnetFunctionApp.Data.Configurations
{
    /// <summary>
    /// EF Core configuration for ConfigSetting -> public.configurations
    /// </summary>
    public class ConfigSettingConfiguration : IEntityTypeConfiguration<ConfigSetting>
    {
        public void Configure(EntityTypeBuilder<ConfigSetting> builder)
        {
            builder.ToTable("configurations");

            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();
            builder.Property(x => x.ConfigType).HasColumnName("config_type").HasMaxLength(100);
            builder.Property(x => x.OwnerId).HasColumnName("owner_id");
            builder.Property(x => x.GroupName).HasColumnName("group_name").HasMaxLength(200);
            builder.Property(x => x.Category).HasColumnName("category").HasMaxLength(200);
            builder.Property(x => x.SubCategory).HasColumnName("sub_category").HasMaxLength(200);
            builder.Property(x => x.Data).HasColumnName("data");
            builder.Property(x => x.Source).HasColumnName("source").HasMaxLength(100);
            builder.Property(x => x.CreatedAt).HasColumnName("created_at").HasColumnType("timestamp without time zone");
            builder.Property(x => x.UpdatedAt).HasColumnName("updated_at").HasColumnType("timestamp without time zone");
        }
    }
}
