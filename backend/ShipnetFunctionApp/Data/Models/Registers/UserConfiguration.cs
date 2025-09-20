using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ShipnetFunctionApp.Data.Models;

namespace ShipnetFunctionApp.Data.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("user");

            builder.HasKey(u => u.Id).HasName("id");

            builder.Property(u => u.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();
            builder.Property(u => u.Name).HasColumnName("name");
            builder.Property(u => u.Email).HasColumnName("email");
            builder.Property(u => u.Image).HasColumnName("image");
            builder.Property(u => u.Password).HasColumnName("password");
            builder.Property(u => u.Role).HasColumnName("role");
            // Add other properties here if you add more columns
        }
    }
}