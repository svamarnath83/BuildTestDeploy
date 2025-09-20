using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using ShipnetFunctionApp.Data.Models;

namespace ShipnetFunctionApp.Data
{
    /// <summary>
    /// Entity Framework DbContext for Shipnet application
    /// Implements connection pooling and proper configuration for Azure Functions
    /// </summary>
    public class ShipnetDbContext : DbContext
    {
        public string CurrentSchema { get; }

        public ShipnetDbContext(DbContextOptions<ShipnetDbContext> options, string schema) : base(options)
        {
            CurrentSchema = schema;
            Console.WriteLine($"[ShipnetDbContext] Created with schema: {CurrentSchema}");
        }

        /// <summary>
        /// Ports table
        /// </summary>
        public DbSet<Port> Ports { get; set; }

        /// <summary>
        /// DistanceSource table
        /// </summary>
        public DbSet<DistanceSource> DistanceSources { get; set; }
        public DbSet<Grade> Grades { get; set; }
        public DbSet<Estimate> Estimates { get; set; }
        public DbSet<CurrencyType> CurrencyTypes { get; set; }
        public DbSet<UnitOfMeasure> UnitsOfMeasure { get; set; }
        public DbSet<Commodity> Commodities { get; set; }
        public DbSet<Vessels> Vessels { get; set; }
        public DbSet<VesselGrade> VesselGrades { get; set; }
        public DbSet<VesselType> VesselTypes { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<ConfigSetting> Configurations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            Console.WriteLine($"[ShipnetDbContext] OnModelCreating using schema: {CurrentSchema}");
            modelBuilder.HasDefaultSchema(CurrentSchema);
            // Configure Port entity
            modelBuilder.ApplyConfiguration(new Configurations.PortConfiguration());

            // Configure DistanceSource entity
            modelBuilder.ApplyConfiguration(new Configurations.DistanceSourceConfiguration());
            modelBuilder.ApplyConfiguration(new Configurations.CommodityConfiguration());
            modelBuilder.ApplyConfiguration(new Configurations.GradeConfiguration());
            modelBuilder.ApplyConfiguration(new Configurations.CurrencyTypeConfiguration());
            modelBuilder.ApplyConfiguration(new Configurations.VesselConfiguration());
            modelBuilder.ApplyConfiguration(new Configurations.UnitOfMeasureConfiguration());
            modelBuilder.ApplyConfiguration(new Configurations.VesselGradeConfiguration());
            modelBuilder.ApplyConfiguration(new Configurations.VesselTypeConfiguration());
            modelBuilder.ApplyConfiguration(new Configurations.EstimateConfiguration());
            modelBuilder.ApplyConfiguration(new Configurations.SubscriptionConfiguration());
            modelBuilder.ApplyConfiguration(new Configurations.ConfigSettingConfiguration());
            // Seed data for common ports
            SeedData(modelBuilder);
            base.OnModelCreating(modelBuilder);
        }

        /// <summary>
        /// Seeds initial data for common ports
        /// </summary>
        private static void SeedData(ModelBuilder modelBuilder)
        {
         
        }
    }

}
