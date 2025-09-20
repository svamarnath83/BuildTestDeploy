using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ShipnetFunctionApp.Data.Migrations.TenantMigrations
{
    /// <inheritdoc />
    public partial class seedDataAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "commodities",
                columns: new[] { "id", "code", "isactive", "name" },
                values: new object[,]
                {
                    { 1, "CRUDE", true, "Crude Oil" },
                    { 2, "MGO", true, "Marine Gas Oil" },
                    { 3, "VLSFO", true, "Very Low Sulfur Fuel Oil" },
                    { 4, "IRONORE", true, "Iron Ore" },
                    { 5, "COAL", true, "Thermal Coal" }
                });

            migrationBuilder.InsertData(
                table: "currencytype",
                columns: new[] { "id", "code", "isactive", "name" },
                values: new object[,]
                {
                    { 1, "EUR", true, "Euro" },
                    { 2, "GBP", true, "British Pound" },
                    { 3, "CHF", true, "Swiss Franc" },
                    { 4, "NOK", true, "Norwegian Krone" },
                    { 5, "SEK", true, "Swedish Krona" },
                    { 6, "DKK", true, "Danish Krone" },
                    { 7, "PLN", true, "Polish Zloty" },
                    { 8, "CZK", true, "Czech Koruna" },
                    { 9, "JPY", true, "Japanese Yen" },
                    { 10, "CNY", true, "Chinese Yuan" },
                    { 11, "INR", true, "Indian Rupee" },
                    { 12, "KRW", true, "South Korean Won" },
                    { 13, "SGD", true, "Singapore Dollar" },
                    { 14, "THB", true, "Thai Baht" },
                    { 15, "MYR", true, "Malaysian Ringgit" },
                    { 16, "IDR", true, "Indonesian Rupiah" },
                    { 17, "AED", true, "UAE Dirham" },
                    { 18, "SAR", true, "Saudi Riyal" },
                    { 19, "QAR", true, "Qatari Riyal" },
                    { 20, "KWD", true, "Kuwaiti Dinar" },
                    { 21, "USD", true, "US Dollar" }
                });

            migrationBuilder.UpdateData(
                table: "grade",
                keyColumn: "id",
                keyValue: 1L,
                column: "createdat",
                value: new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7622));

            migrationBuilder.UpdateData(
                table: "grade",
                keyColumn: "id",
                keyValue: 2L,
                column: "createdat",
                value: new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7626));

            migrationBuilder.UpdateData(
                table: "grade",
                keyColumn: "id",
                keyValue: 3L,
                column: "createdat",
                value: new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7629));

            migrationBuilder.InsertData(
                table: "unitsofmeasure",
                columns: new[] { "id", "code", "isactive", "name" },
                values: new object[,]
                {
                    { 1, "C", true, "CUBIC" },
                    { 2, "L", true, "LONG TON" },
                    { 3, "M", true, "METRIC TON" },
                    { 4, "S", true, "SHORT TON" },
                    { 5, "LM", true, "LUMPSUM" }
                });

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 1,
                column: "createdate",
                value: new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7412));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 2,
                column: "createdate",
                value: new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7434));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 3,
                column: "createdate",
                value: new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7436));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 4,
                column: "createdate",
                value: new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7438));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 5,
                column: "createdate",
                value: new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7440));

            migrationBuilder.InsertData(
                table: "vesselgrades",
                columns: new[] { "id", "gradeid", "gradename", "sortorder", "type", "uomid", "vesselid" },
                values: new object[,]
                {
                    { 1L, 1L, "HSFO", 1, "primary", 3, 1L },
                    { 2L, 2L, "MGO", 2, "secondary", 3, 1L },
                    { 3L, 3L, "VLSFO", 3, "secondary", 3, 1L },
                    { 4L, 1L, "HSFO", 1, "primary", 3, 2L },
                    { 5L, 2L, "MGO", 2, "secondary", 3, 2L },
                    { 6L, 3L, "VLSFO", 3, "secondary", 3, 2L },
                    { 7L, 1L, "HSFO", 1, "primary", 3, 3L },
                    { 8L, 2L, "MGO", 2, "secondary", 3, 3L },
                    { 9L, 3L, "VLSFO", 3, "secondary", 3, 3L }
                });

            migrationBuilder.InsertData(
                table: "vessels",
                columns: new[] { "id", "code", "dwt", "imo", "name", "runningcost", "type", "vesseljson" },
                values: new object[,]
                {
                    { 1L, "V001", 199000, 9876543, "Aurora Star", 199744, 1L, "{\"speedConsumptions\":[{\"id\":1,\"speed\":\"\",\"mode\":\"port\",\"gradeId\":1,\"gradeName\":\"HSFO\",\"consumption\":67,\"isDefault\":false},{\"id\":1,\"speed\":\"\",\"mode\":\"port\",\"gradeId\":2,\"gradeName\":\"MGO\",\"consumption\":34,\"isDefault\":false},{\"id\":1,\"speed\":\"\",\"mode\":\"port\",\"gradeId\":3,\"gradeName\":\"VLSFO\",\"consumption\":54,\"isDefault\":false},{\"id\":2,\"speed\":\"34\",\"mode\":\"ballast\",\"gradeId\":1,\"gradeName\":\"HSFO\",\"consumption\":34,\"isDefault\":true},{\"id\":2,\"speed\":\"34\",\"mode\":\"ballast\",\"gradeId\":2,\"gradeName\":\"MGO\",\"consumption\":67,\"isDefault\":true},{\"id\":2,\"speed\":\"34\",\"mode\":\"ballast\",\"gradeId\":3,\"gradeName\":\"VLSFO\",\"consumption\":89,\"isDefault\":true},{\"id\":3,\"speed\":\"34\",\"mode\":\"laden\",\"gradeId\":1,\"gradeName\":\"HSFO\",\"consumption\":76,\"isDefault\":true},{\"id\":3,\"speed\":\"34\",\"mode\":\"laden\",\"gradeId\":2,\"gradeName\":\"MGO\",\"consumption\":78,\"isDefault\":true},{\"id\":3,\"speed\":\"34\",\"mode\":\"laden\",\"gradeId\":3,\"gradeName\":\"VLSFO\",\"consumption\":65,\"isDefault\":true}]}" },
                    { 2L, "V005", 198700, 9701234, "Blue Horizon", 689909, 2L, "{\"speedConsumptions\":[{\"id\":1,\"speed\":\"\",\"mode\":\"port\",\"gradeId\":1,\"gradeName\":\"HSFO\",\"consumption\":67,\"isDefault\":false},{\"id\":1,\"speed\":\"\",\"mode\":\"port\",\"gradeId\":2,\"gradeName\":\"MGO\",\"consumption\":34,\"isDefault\":false},{\"id\":1,\"speed\":\"\",\"mode\":\"port\",\"gradeId\":3,\"gradeName\":\"VLSFO\",\"consumption\":54,\"isDefault\":false},{\"id\":2,\"speed\":\"34\",\"mode\":\"ballast\",\"gradeId\":1,\"gradeName\":\"HSFO\",\"consumption\":34,\"isDefault\":true},{\"id\":2,\"speed\":\"34\",\"mode\":\"ballast\",\"gradeId\":2,\"gradeName\":\"MGO\",\"consumption\":67,\"isDefault\":true},{\"id\":2,\"speed\":\"34\",\"mode\":\"ballast\",\"gradeId\":3,\"gradeName\":\"VLSFO\",\"consumption\":89,\"isDefault\":true},{\"id\":3,\"speed\":\"34\",\"mode\":\"laden\",\"gradeId\":1,\"gradeName\":\"HSFO\",\"consumption\":76,\"isDefault\":true},{\"id\":3,\"speed\":\"34\",\"mode\":\"laden\",\"gradeId\":2,\"gradeName\":\"MGO\",\"consumption\":78,\"isDefault\":true},{\"id\":3,\"speed\":\"34\",\"mode\":\"laden\",\"gradeId\":3,\"gradeName\":\"VLSFO\",\"consumption\":65,\"isDefault\":true}]}" },
                    { 3L, "V0019", 200000, 1234567, "Aqua Nova", 5465, 1L, "{\"speedConsumptions\":[{\"id\":1,\"speed\":\"\",\"mode\":\"port\",\"gradeId\":1,\"gradeName\":\"HSFO\",\"consumption\":45,\"isDefault\":false},{\"id\":1,\"speed\":\"\",\"mode\":\"port\",\"gradeId\":2,\"gradeName\":\"VLSFO\",\"consumption\":87,\"isDefault\":false},{\"id\":1,\"speed\":\"\",\"mode\":\"port\",\"gradeId\":3,\"gradeName\":\"VLSFO\",\"consumption\":76,\"isDefault\":false},{\"id\":2,\"speed\":\"45\",\"mode\":\"ballast\",\"gradeId\":1,\"gradeName\":\"HSFO\",\"consumption\":78,\"isDefault\":false},{\"id\":2,\"speed\":\"45\",\"mode\":\"ballast\",\"gradeId\":2,\"gradeName\":\"MGO\",\"consumption\":65,\"isDefault\":false},{\"id\":2,\"speed\":\"45\",\"mode\":\"ballast\",\"gradeId\":3,\"gradeName\":\"VLSFO\",\"consumption\":45,\"isDefault\":false},{\"id\":3,\"speed\":\"45\",\"mode\":\"laden\",\"gradeId\":3,\"gradeName\":\"VLSFO\",\"consumption\":87,\"isDefault\":false},{\"id\":4,\"speed\":\"34\",\"mode\":\"laden\",\"gradeId\":3,\"gradeName\":\"VLSFO\",\"consumption\":56,\"isDefault\":true},{\"id\":5,\"speed\":\"34\",\"mode\":\"ballast\",\"gradeId\":3,\"gradeName\":\"VLSFO\",\"consumption\":65,\"isDefault\":true}]}" }
                });

            migrationBuilder.InsertData(
                table: "vesseltypes",
                columns: new[] { "id", "calctype", "category", "createdate", "createdby", "isactive", "name", "updatedate", "updatedby" },
                values: new object[,]
                {
                    { 1L, "per_ton", 1, new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7844), 1, true, "Bulk Carrier", new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7845), 1 },
                    { 2L, "per_day", 2, new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7848), 2, true, "Container Ship", new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7849), 2 },
                    { 3L, "Weight", 3, new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7810), 3, true, "Tanker", new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7813), 3 },
                    { 4L, "Count", 4, new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7817), 4, true, "RoRo", new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7818), 4 },
                    { 5L, "Volume", 5, new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7821), 5, true, "LNG Carrier", new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7822), 5 },
                    { 6L, "Weight", 6, new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7825), 6, true, "General Cargo", new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7826), 6 },
                    { 7L, "Count", 7, new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7829), 7, true, "Passenger Ship", new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7829), 7 },
                    { 8L, "Weight", 8, new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7832), 8, false, "Heavy Lift", new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7833), 8 },
                    { 9L, "Volume", 9, new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7836), 9, true, "Reefer", new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7837), 9 },
                    { 10L, "Weight", 10, new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7840), 10, false, "Chemical Tanker", new DateTime(2025, 8, 25, 9, 54, 5, 250, DateTimeKind.Local).AddTicks(7841), 10 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "commodities",
                keyColumn: "id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "commodities",
                keyColumn: "id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "commodities",
                keyColumn: "id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "commodities",
                keyColumn: "id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "commodities",
                keyColumn: "id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "currencytype",
                keyColumn: "id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "currencytype",
                keyColumn: "id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "currencytype",
                keyColumn: "id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "currencytype",
                keyColumn: "id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "currencytype",
                keyColumn: "id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "currencytype",
                keyColumn: "id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "currencytype",
                keyColumn: "id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "currencytype",
                keyColumn: "id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "currencytype",
                keyColumn: "id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "currencytype",
                keyColumn: "id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "currencytype",
                keyColumn: "id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "currencytype",
                keyColumn: "id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "currencytype",
                keyColumn: "id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "currencytype",
                keyColumn: "id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "currencytype",
                keyColumn: "id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "currencytype",
                keyColumn: "id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "currencytype",
                keyColumn: "id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "currencytype",
                keyColumn: "id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "currencytype",
                keyColumn: "id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "currencytype",
                keyColumn: "id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "currencytype",
                keyColumn: "id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "unitsofmeasure",
                keyColumn: "id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "unitsofmeasure",
                keyColumn: "id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "unitsofmeasure",
                keyColumn: "id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "unitsofmeasure",
                keyColumn: "id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "unitsofmeasure",
                keyColumn: "id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "vesselgrades",
                keyColumn: "id",
                keyValue: 1L);

            migrationBuilder.DeleteData(
                table: "vesselgrades",
                keyColumn: "id",
                keyValue: 2L);

            migrationBuilder.DeleteData(
                table: "vesselgrades",
                keyColumn: "id",
                keyValue: 3L);

            migrationBuilder.DeleteData(
                table: "vesselgrades",
                keyColumn: "id",
                keyValue: 4L);

            migrationBuilder.DeleteData(
                table: "vesselgrades",
                keyColumn: "id",
                keyValue: 5L);

            migrationBuilder.DeleteData(
                table: "vesselgrades",
                keyColumn: "id",
                keyValue: 6L);

            migrationBuilder.DeleteData(
                table: "vesselgrades",
                keyColumn: "id",
                keyValue: 7L);

            migrationBuilder.DeleteData(
                table: "vesselgrades",
                keyColumn: "id",
                keyValue: 8L);

            migrationBuilder.DeleteData(
                table: "vesselgrades",
                keyColumn: "id",
                keyValue: 9L);

            migrationBuilder.DeleteData(
                table: "vessels",
                keyColumn: "id",
                keyValue: 1L);

            migrationBuilder.DeleteData(
                table: "vessels",
                keyColumn: "id",
                keyValue: 2L);

            migrationBuilder.DeleteData(
                table: "vessels",
                keyColumn: "id",
                keyValue: 3L);

            migrationBuilder.DeleteData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 1L);

            migrationBuilder.DeleteData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 2L);

            migrationBuilder.DeleteData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 3L);

            migrationBuilder.DeleteData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 4L);

            migrationBuilder.DeleteData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 5L);

            migrationBuilder.DeleteData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 6L);

            migrationBuilder.DeleteData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 7L);

            migrationBuilder.DeleteData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 8L);

            migrationBuilder.DeleteData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 9L);

            migrationBuilder.DeleteData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 10L);

            migrationBuilder.UpdateData(
                table: "grade",
                keyColumn: "id",
                keyValue: 1L,
                column: "createdat",
                value: new DateTime(2025, 8, 22, 16, 46, 26, 29, DateTimeKind.Local).AddTicks(3221));

            migrationBuilder.UpdateData(
                table: "grade",
                keyColumn: "id",
                keyValue: 2L,
                column: "createdat",
                value: new DateTime(2025, 8, 22, 16, 46, 26, 29, DateTimeKind.Local).AddTicks(3225));

            migrationBuilder.UpdateData(
                table: "grade",
                keyColumn: "id",
                keyValue: 3L,
                column: "createdat",
                value: new DateTime(2025, 8, 22, 16, 46, 26, 29, DateTimeKind.Local).AddTicks(3228));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 1,
                column: "createdate",
                value: new DateTime(2025, 8, 22, 16, 46, 26, 29, DateTimeKind.Local).AddTicks(2982));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 2,
                column: "createdate",
                value: new DateTime(2025, 8, 22, 16, 46, 26, 29, DateTimeKind.Local).AddTicks(3010));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 3,
                column: "createdate",
                value: new DateTime(2025, 8, 22, 16, 46, 26, 29, DateTimeKind.Local).AddTicks(3012));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 4,
                column: "createdate",
                value: new DateTime(2025, 8, 22, 16, 46, 26, 29, DateTimeKind.Local).AddTicks(3014));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 5,
                column: "createdate",
                value: new DateTime(2025, 8, 22, 16, 46, 26, 29, DateTimeKind.Local).AddTicks(3016));
        }
    }
}
