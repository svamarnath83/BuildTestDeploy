using Microsoft.EntityFrameworkCore;
using ShipnetFunctionApp.Data.Models;
using ShipnetFunctionApp.Data.Models.Charterering;
using ShipnetFunctionApp.Data.Models.Operation;
using ShipnetFunctionApp.Data.Models.Registers;
using ShipnetFunctionApp.Data.Seed;
using System.Threading.Tasks; // Add this if not already present

namespace ShipnetFunctionApp.Data
{
    /// <summary>
    /// Multi-tenant Entity Framework DbContext for Shipnet application
    /// Implements connection pooling, schema management and proper configuration for tenant-specific data
    /// </summary>
    public class MultiTenantSnContext : DbContext
    {
        private readonly string _schema;
        private readonly bool _disableDefaultSchema;

        public string CurrentSchema => _schema;

        // Single constructor that takes options and an optional schema parameter
        public MultiTenantSnContext(
            DbContextOptions<MultiTenantSnContext> options, 
            string schema = "public",
            bool disableDefaultSchema = false) : base(options)
        {
            _schema = schema ?? "public";
            _disableDefaultSchema = disableDefaultSchema;
            //if (schema?.ToUpper() == "PUBLIC")
              //  throw new InvalidOperationException("Public schema is not allowed.");
        }

        /// <summary>
        /// Ports table
        /// </summary>
        public DbSet<Port> Ports { get; set; }

        /// <summary>
        /// DistanceSource table
        /// </summary>
      
        public DbSet<Grade> Grades { get; set; }
        public DbSet<Estimate> Estimates { get; set; }
        public DbSet<CurrencyType> CurrencyTypes { get; set; }
        public DbSet<UnitOfMeasure> UnitsOfMeasure { get; set; }
        public DbSet<Commodity> Commodities { get; set; }
        
        // Accounting entities
        public DbSet<AccountGroup> AccountGroups { get; set; }
        public DbSet<Account> Accounts { get; set; }
        
        public DbSet<Vessels> Vessels { get; set; }
        public DbSet<VesselGrade> VesselGrades { get; set; }
        public DbSet<VesselType> VesselTypes { get; set; }
        public DbSet<VesselCategory> VesselCategories { get; set; }
        public DbSet<ConfigSetting> Configurations { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<ActivityLog> ActivityLogs { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<ModuleConfig> ModuleConfigs { get; set; }
        public DbSet<VoyagePortRotation> VoyagePortrotations { get; set; }
        public DbSet<VoyageCargo> Voyagecargos { get; set; }
        public DbSet<VoyageHeader> VoyageHeaders { get; set; }

        /// <summary>
        /// Static method to seed runtime data after migrations (call from startup).
        /// </summary>
        public static async Task SeedRuntimeDataAsync(MultiTenantSnContext ctx)
        {
            // Call runtime seeds here (idempotent)
            await ctx.SeedAccountGroupsAsync();
            
            // Add other runtime seeds if needed
            // await ctx.SeedOtherDataAsync();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            Console.WriteLine($"[MultiTenantSnContext] OnModelCreating using schema: {CurrentSchema} (disabled={_disableDefaultSchema})");
            if (!_disableDefaultSchema && !string.IsNullOrWhiteSpace(CurrentSchema))
            {
                modelBuilder.HasDefaultSchema(CurrentSchema);
            }

            // apply configurations from assembly if you have them
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(MultiTenantSnContext).Assembly);

            // central seeding for all registers (includes AccountGroups via SeedDataExtensions)
            modelBuilder.SeedData(); // Static seeds

            modelBuilder.Entity<AccountGroup>()
                .Property(a => a.Id)
                .ValueGeneratedOnAdd();

            base.OnModelCreating(modelBuilder);
        }
    }
}
