using Microsoft.EntityFrameworkCore;
using ShipnetFunctionApp.Data.Models;

namespace ShipnetFunctionApp.Data
{
    /// <summary>
    /// Admin Entity Framework DbContext for Shipnet application
    /// Handles system-wide admin operations and configuration
    /// Always uses the 'public' schema
    /// </summary>
    public class AdminContext : DbContext
    {
        private const string ADMIN_SCHEMA = "public";

        public AdminContext(DbContextOptions<AdminContext> options) : base(options)
        {
            Console.WriteLine($"[AdminContext] Created with fixed schema: {ADMIN_SCHEMA}");
        }

        /// <summary>
        /// Subscriptions table - contains tenant account information
        /// </summary>
        public DbSet<Subscription> Subscriptions { get; set; }

        public DbSet<DistanceSource> DistanceSources { get; set; }

        /// <summary>
        /// Configurations table - contains system-wide configuration
        /// </summary>
        public DbSet<ConfigSetting> SystemConfigurations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            Console.WriteLine($"[AdminContext] OnModelCreating using fixed schema: {ADMIN_SCHEMA}");
            modelBuilder.HasDefaultSchema(ADMIN_SCHEMA);

            // Apply subscription configuration
            modelBuilder.ApplyConfiguration(new Configurations.SubscriptionConfiguration());

            // Apply config setting configuration with the proper mapping
            modelBuilder.ApplyConfiguration(new Configurations.ConfigSettingConfiguration());

            modelBuilder.ApplyConfiguration(new Configurations.DistanceSourceConfiguration());

            base.OnModelCreating(modelBuilder);
        }
    }
}
