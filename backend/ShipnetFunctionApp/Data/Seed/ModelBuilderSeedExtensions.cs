using Microsoft.EntityFrameworkCore;
using ShipnetFunctionApp.Data.Models;
using static Grpc.Core.Metadata;

namespace ShipnetFunctionApp.Data.Seed
{
    public static class ModelBuilderSeedExtensions
    {
        // Use a deterministic local timestamp to avoid EF generating UpdateData on every migration
        private static readonly DateTime SeedTimestamp = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Local);

        public static void SeedData(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<VesselCategory>().HasData(
                new VesselCategory { Id = 1, Name = "Bulk Carrier", IsActive = true, CreatedAt = SeedTimestamp },
                new VesselCategory { Id = 2, Name = "Tanker", IsActive = true, CreatedAt = SeedTimestamp },
                new VesselCategory { Id = 3, Name = "Container", IsActive = true, CreatedAt = SeedTimestamp },
                new VesselCategory { Id = 4, Name = "Gas Carrier", IsActive = true, CreatedAt = SeedTimestamp },
                new VesselCategory { Id = 5, Name = "General Cargo", IsActive = true, CreatedAt = SeedTimestamp }
            );

            modelBuilder.Entity<Grade>().HasData(
                new Grade { Id = 1, Name = "HSFO", Price = 45, InUse = true, CreatedAt = SeedTimestamp },
                new Grade { Id = 2, Name = "MGO", Price = 34, InUse = true, CreatedAt = SeedTimestamp },
                new Grade { Id = 3, Name = "VLSFO", Price = 89, InUse = true, CreatedAt = SeedTimestamp }
            );

            modelBuilder.Entity<Vessels>().HasData(
                new Vessels
                {
                    Id = 1,
                    Name = "Aurora Star",
                    Code = "V001",
                    Dwt = 199000,
                    Type = 1,
                    RunningCost = 199744,
                    IMO = 9876543,
                    Latitude = "57.5429",
                    Longitude = "4.9995",
                    vesseljson = @"{""speedConsumptions"": [{""id"": 1, ""speed"": """", ""mode"": ""port"", ""gradeId"": 1, ""gradeName"": ""HSFO"", ""consumption"": 67, ""isDefault"": false }, {""id"": 1, ""speed"": """", ""mode"": ""port"", ""gradeId"": 2, ""gradeName"": ""MGO"", ""consumption"": 34, ""isDefault"": false }, {""id"": 1, ""speed"": """", ""mode"": ""port"", ""gradeId"": 3, ""gradeName"": ""VLSFO"", ""consumption"": 54, ""isDefault"": false }, {""id"": 2, ""speed"": ""34"", ""mode"": ""ballast"", ""gradeId"": 1, ""gradeName"": ""HSFO"", ""consumption"": 34, ""isDefault"": true }, {""id"": 2, ""speed"": ""34"", ""mode"": ""ballast"", ""gradeId"": 2, ""gradeName"": ""MGO"", ""consumption"": 67, ""isDefault"": true }, {""id"": 2, ""speed"": ""34"", ""mode"": ""ballast"", ""gradeId"": 3, ""gradeName"": ""VLSFO"", ""consumption"": 89, ""isDefault"": true }, {""id"": 3, ""speed"": ""34"", ""mode"": ""laden"", ""gradeId"": 1, ""gradeName"": ""HSFO"", ""consumption"": 76, ""isDefault"": true }, {""id"": 3, ""speed"": ""34"", ""mode"": ""laden"", ""gradeId"": 2, ""gradeName"": ""MGO"", ""consumption"": 78, ""isDefault"": true }, {""id"": 3, ""speed"": ""34"", ""mode"": ""laden"", ""gradeId"": 3, ""gradeName"": ""VLSFO"", ""consumption"": 65, ""isDefault"": true }] }"

                },
                new Vessels
                {
                    Id = 2,
                    Name = "Blue Horizon",
                    Code = "V005",
                    Dwt = 198700,
                    Type = 2,
                    RunningCost = 689909,
                    IMO = 9701234,
                    Latitude = "53.34499",
                    Longitude = "-6.19605",
                    vesseljson = @"{""speedConsumptions"": [{""id"": 1, ""speed"": """", ""mode"": ""port"", ""gradeId"": 1, ""gradeName"": ""HSFO"", ""consumption"": 67, ""isDefault"": false }, {""id"": 1, ""speed"": """", ""mode"": ""port"", ""gradeId"": 2, ""gradeName"": ""MGO"", ""consumption"": 34, ""isDefault"": false }, {""id"": 1, ""speed"": """", ""mode"": ""port"", ""gradeId"": 3, ""gradeName"": ""VLSFO"", ""consumption"": 54, ""isDefault"": false }, {""id"": 2, ""speed"": ""34"", ""mode"": ""ballast"", ""gradeId"": 1, ""gradeName"": ""HSFO"", ""consumption"": 34, ""isDefault"": true }, {""id"": 2, ""speed"": ""34"", ""mode"": ""ballast"", ""gradeId"": 2, ""gradeName"": ""MGO"", ""consumption"": 67, ""isDefault"": true }, {""id"": 2, ""speed"": ""34"", ""mode"": ""ballast"", ""gradeId"": 3, ""gradeName"": ""VLSFO"", ""consumption"": 89, ""isDefault"": true }, {""id"": 3, ""speed"": ""34"", ""mode"": ""laden"", ""gradeId"": 1, ""gradeName"": ""HSFO"", ""consumption"": 76, ""isDefault"": true }, {""id"": 3, ""speed"": ""34"", ""mode"": ""laden"", ""gradeId"": 2, ""gradeName"": ""MGO"", ""consumption"": 78, ""isDefault"": true }, {""id"": 3, ""speed"": ""34"", ""mode"": ""laden"", ""gradeId"": 3, ""gradeName"": ""VLSFO"", ""consumption"": 65, ""isDefault"": true }] }"
                },
                new Vessels
                {
                    Id = 3,
                    Name = "Aqua Nova",
                    Code = "V0019",
                    Dwt = 200000,
                    Type = 1,
                    RunningCost = 5465,
                    IMO = 1234567,
                    Latitude = "51.89",
                    Longitude = "4.24",
                    vesseljson = @"{""speedConsumptions"": [{""id"": 1, ""speed"": """", ""mode"": ""port"", ""gradeId"": 1, ""gradeName"": ""HSFO"", ""consumption"": 45, ""isDefault"": false }, {""id"": 1, ""speed"": """", ""mode"": ""port"", ""gradeId"": 2, ""gradeName"": ""VLSFO"", ""consumption"": 87, ""isDefault"": false }, {""id"": 1, ""speed"": """", ""mode"": ""port"", ""gradeId"": 3, ""gradeName"": ""VLSFO"", ""consumption"": 76, ""isDefault"": false }, {""id"": 2, ""speed"": ""45"", ""mode"": ""ballast"", ""gradeId"": 1, ""gradeName"": ""HSFO"", ""consumption"": 78, ""isDefault"": false }, {""id"": 2, ""speed"": ""45"", ""mode"": ""ballast"", ""gradeId"": 2, ""gradeName"": ""MGO"", ""consumption"": 65, ""isDefault"": false }, {""id"": 2, ""speed"": ""45"", ""mode"": ""ballast"", ""gradeId"": 3, ""gradeName"": ""VLSFO"", ""consumption"": 45, ""isDefault"": false }, {""id"": 3, ""speed"": ""45"", ""mode"": ""laden"", ""gradeId"": 3, ""gradeName"": ""VLSFO"", ""consumption"": 87, ""isDefault"": false }, {""id"": 4, ""speed"": ""34"", ""mode"": ""laden"", ""gradeId"": 3, ""gradeName"": ""VLSFO"", ""consumption"": 56, ""isDefault"": true }, {""id"": 5, ""speed"": ""34"", ""mode"": ""ballast"", ""gradeId"": 3, ""gradeName"": ""VLSFO"", ""consumption"": 65, ""isDefault"": true }] }"
                }
            );

            // VesselGrade seed
            modelBuilder.Entity<VesselGrade>().HasData(
                new VesselGrade { Id = 1, vesselId = 1, GradeId = 1, UomId = 3, Type = "primary", GradeName = "HSFO", SortOrder = 1 },
                new VesselGrade { Id = 2, vesselId = 1, GradeId = 2, UomId = 3, Type = "secondary", GradeName = "MGO", SortOrder = 2 },
                new VesselGrade { Id = 3, vesselId = 1, GradeId = 3, UomId = 3, Type = "secondary", GradeName = "VLSFO", SortOrder = 3 },

                new VesselGrade { Id = 4, vesselId = 2, GradeId = 1, UomId = 3, Type = "primary", GradeName = "HSFO", SortOrder = 1 },
                new VesselGrade { Id = 5, vesselId = 2, GradeId = 2, UomId = 3, Type = "secondary", GradeName = "MGO", SortOrder = 2 },
                new VesselGrade { Id = 6, vesselId = 2, GradeId = 3, UomId = 3, Type = "secondary", GradeName = "VLSFO", SortOrder = 3 },

                new VesselGrade { Id = 7, vesselId = 3, GradeId = 1, UomId = 3, Type = "primary", GradeName = "HSFO", SortOrder = 1 },
                new VesselGrade { Id = 8, vesselId = 3, GradeId = 2, UomId = 3, Type = "secondary", GradeName = "MGO", SortOrder = 2 },
                new VesselGrade { Id = 9, vesselId = 3, GradeId = 3, UomId = 3, Type = "secondary", GradeName = "VLSFO", SortOrder = 3 }
            );

            // VesselType seeds
            modelBuilder.Entity<VesselType>().HasData(
                new VesselType
                {
                    Id = 3,
                    Name = "Tanker",
                    Category = 3,
                    CalcType = "Weight",
                    IsActive = true,
                    CreatedBy = 3,
                    UpdatedBy = 3,
                    CreatedAt = SeedTimestamp,
                    UpdatedAt = SeedTimestamp
                },
                new VesselType
                {
                    Id = 4,
                    Name = "RoRo",
                    Category = 4,
                    CalcType = "Count",
                    IsActive = true,
                    CreatedBy = 4,
                    UpdatedBy = 4,
                    CreatedAt = SeedTimestamp,
                    UpdatedAt = SeedTimestamp
                },
                new VesselType
                {
                    Id = 5,
                    Name = "LNG Carrier",
                    Category = 5,
                    CalcType = "Volume",
                    IsActive = true,
                    CreatedBy = 5,
                    UpdatedBy = 5,
                    CreatedAt = SeedTimestamp,
                    UpdatedAt = SeedTimestamp
                },
                new VesselType
                {
                    Id = 6,
                    Name = "General Cargo",
                    Category = 6,
                    CalcType = "Weight",
                    IsActive = true,
                    CreatedBy = 6,
                    UpdatedBy = 6,
                    CreatedAt = SeedTimestamp,
                    UpdatedAt = SeedTimestamp
                },
                new VesselType
                {
                    Id = 7,
                    Name = "Passenger Ship",
                    Category = 7,
                    CalcType = "Count",
                    IsActive = true,
                    CreatedBy = 7,
                    UpdatedBy = 7,
                    CreatedAt = SeedTimestamp,
                    UpdatedAt = SeedTimestamp
                },
                new VesselType
                {
                    Id = 8,
                    Name = "Heavy Lift",
                    Category = 8,
                    CalcType = "Weight",
                    IsActive = false,
                    CreatedBy = 8,
                    UpdatedBy = 8,
                    CreatedAt = SeedTimestamp,
                    UpdatedAt = SeedTimestamp
                },
                new VesselType
                {
                    Id = 9,
                    Name = "Reefer",
                    Category = 9,
                    CalcType = "Volume",
                    IsActive = true,
                    CreatedBy = 9,
                    UpdatedBy = 9,
                    CreatedAt = SeedTimestamp,
                    UpdatedAt = SeedTimestamp
                },
                new VesselType
                {
                    Id = 10,
                    Name = "Chemical Tanker",
                    Category = 10,
                    CalcType = "Weight",
                    IsActive = false,
                    CreatedBy = 10,
                    UpdatedBy = 10,
                    CreatedAt = SeedTimestamp,
                    UpdatedAt = SeedTimestamp
                },
                new VesselType
                {
                    Id = 1,
                    Name = "Bulk Carrier",
                    Category = 1,
                    CalcType = "per_ton",
                    IsActive = true,
                    CreatedBy = 1,
                    UpdatedBy = 1,
                    CreatedAt = SeedTimestamp,
                    UpdatedAt = SeedTimestamp

                },
                new VesselType
                {
                    Id = 2,
                    Name = "Container Ship",
                    Category = 2,
                    CalcType = "per_day",
                    IsActive = true,
                    CreatedBy = 2,
                    UpdatedBy = 2,
                    CreatedAt = SeedTimestamp,
                    UpdatedAt = SeedTimestamp
                }
            );

            // Commodity seeds
            modelBuilder.Entity<Commodity>().HasData(
                new Commodity { Id = 1, Code = "CRUDE",   Name = "Crude Oil",                      IsActive = true },
                new Commodity { Id = 2, Code = "MGO",     Name = "Marine Gas Oil",                 IsActive = true },
                new Commodity { Id = 3, Code = "VLSFO",   Name = "Very Low Sulfur Fuel Oil",       IsActive = true },
                new Commodity { Id = 4, Code = "IRONORE", Name = "Iron Ore",                        IsActive = true },
                new Commodity { Id = 5, Code = "COAL",    Name = "Thermal Coal",                   IsActive = true }
            );

            // UnitOfMeasure seeds
            modelBuilder.Entity<UnitOfMeasure>().HasData(
                new UnitOfMeasure { Id = 1, Code = "C",  Name = "CUBIC",      IsActive = true },
                new UnitOfMeasure { Id = 2, Code = "L",  Name = "LONG TON",   IsActive = true },
                new UnitOfMeasure { Id = 3, Code = "M",  Name = "METRIC TON", IsActive = true },
                new UnitOfMeasure { Id = 4, Code = "S",  Name = "SHORT TON",  IsActive = true },
                new UnitOfMeasure { Id = 5, Code = "LM", Name = "LUMPSUM",    IsActive = true }
            );

            // CurrencyType seeds (Europe, Asia, GCC/Emirates)
            modelBuilder.Entity<CurrencyType>().HasData(
                // Europe
                new CurrencyType { Id = 1,  Code = "EUR", Name = "Euro",                   IsActive = true },
                new CurrencyType { Id = 2,  Code = "GBP", Name = "British Pound",          IsActive = true },
                new CurrencyType { Id = 3,  Code = "CHF", Name = "Swiss Franc",            IsActive = true },
                new CurrencyType { Id = 4,  Code = "NOK", Name = "Norwegian Krone",        IsActive = true },
                new CurrencyType { Id = 5,  Code = "SEK", Name = "Swedish Krona",          IsActive = true },
                new CurrencyType { Id = 6,  Code = "DKK", Name = "Danish Krone",           IsActive = true },
                new CurrencyType { Id = 7,  Code = "PLN", Name = "Polish Zloty",           IsActive = true },
                new CurrencyType { Id = 8,  Code = "CZK", Name = "Czech Koruna",           IsActive = true },

                // Asia
                new CurrencyType { Id = 9,  Code = "JPY", Name = "Japanese Yen",           IsActive = true },
                new CurrencyType { Id = 10, Code = "CNY", Name = "Chinese Yuan",           IsActive = true },
                new CurrencyType { Id = 11, Code = "INR", Name = "Indian Rupee",           IsActive = true },
                new CurrencyType { Id = 12, Code = "KRW", Name = "South Korean Won",       IsActive = true },
                new CurrencyType { Id = 13, Code = "SGD", Name = "Singapore Dollar",       IsActive = true },
                new CurrencyType { Id = 14, Code = "THB", Name = "Thai Baht",              IsActive = true },
                new CurrencyType { Id = 15, Code = "MYR", Name = "Malaysian Ringgit",      IsActive = true },
                new CurrencyType { Id = 16, Code = "IDR", Name = "Indonesian Rupiah",      IsActive = true },

                // GCC / Emirates region
                new CurrencyType { Id = 17, Code = "AED", Name = "UAE Dirham",             IsActive = true },
                new CurrencyType { Id = 18, Code = "SAR", Name = "Saudi Riyal",            IsActive = true },
                new CurrencyType { Id = 19, Code = "QAR", Name = "Qatari Riyal",           IsActive = true },
                new CurrencyType { Id = 20, Code = "KWD", Name = "Kuwaiti Dinar", IsActive = true },

                 new CurrencyType { Id = 21, Code = "USD", Name = "US Dollar", IsActive = true }
            );

            // Country seeds (no Iso3)
            modelBuilder.Entity<Country>().HasData(
                // GCC / Emirates region
                new Country { Id = 1, Code = "AE", Name = "United Arab Emirates", IsActive = true },
                new Country { Id = 2, Code = "SA", Name = "Saudi Arabia", IsActive = true },
                new Country { Id = 3, Code = "QA", Name = "Qatar", IsActive = true },
                new Country { Id = 4, Code = "KW", Name = "Kuwait", IsActive = true },

                // Asia
                new Country { Id = 5, Code = "IN", Name = "India", IsActive = true },
                new Country { Id = 6, Code = "JP", Name = "Japan", IsActive = true },
                new Country { Id = 7, Code = "SG", Name = "Singapore", IsActive = true },
                new Country { Id = 8, Code = "CN", Name = "China", IsActive = true },
                new Country { Id = 9, Code = "KR", Name = "South Korea", IsActive = true },
                new Country { Id = 10, Code = "MY", Name = "Malaysia", IsActive = true },
                new Country { Id = 11, Code = "TH", Name = "Thailand", IsActive = true },

                // Europe
                new Country { Id = 12, Code = "GB", Name = "United Kingdom", IsActive = true },
                new Country { Id = 13, Code = "DE", Name = "Germany", IsActive = true },
                new Country { Id = 14, Code = "FR", Name = "France", IsActive = true },
                new Country { Id = 15, Code = "NO", Name = "Norway", IsActive = true },
                new Country { Id = 16, Code = "SE", Name = "Sweden", IsActive = true },
                new Country { Id = 17, Code = "ES", Name = "Spain", IsActive = true },
                new Country { Id = 18, Code = "IT", Name = "Italy", IsActive = true },
                new Country { Id = 19, Code = "NL", Name = "Netherlands", IsActive = true },
                new Country { Id = 20, Code = "BE", Name = "Belgium", IsActive = true }
            );
        }
    }
}