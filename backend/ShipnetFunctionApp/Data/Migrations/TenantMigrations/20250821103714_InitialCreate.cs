using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ShipnetFunctionApp.Data.Migrations.TenantMigrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "commodities",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    code = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    isactive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_commodities", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "configurations",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    config_type = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    owner_id = table.Column<long>(type: "bigint", nullable: true),
                    group_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    category = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    sub_category = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    data = table.Column<string>(type: "text", nullable: true),
                    source = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_configurations", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "currencytype",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    code = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    isactive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_currencytype", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "estimates",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    estimateno = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    estimatedate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    shiptype = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    ship = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    commodity = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    loadports = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    dischargeports = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    status = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    voyageno = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    shipanalysis = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_estimates", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "grade",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    price = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    inuse = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    createdat = table.Column<DateTime>(type: "timestamp with time zone", nullable: true, defaultValueSql: "NOW()"),
                    updatedat = table.Column<DateTime>(type: "timestamp with time zone", nullable: true, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_grade", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "ports",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    portcode = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    unctad = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    netpascode = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    ets = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    ishistorical = table.Column<bool>(type: "boolean", nullable: true),
                    isactive = table.Column<bool>(type: "boolean", nullable: false),
                    additionaldata = table.Column<string>(type: "text", nullable: true),
                    rankorder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ports", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "sndistance",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    fromport = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    toport = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    distance = table.Column<decimal>(type: "numeric", nullable: false),
                    xmldata = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sndistance", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "unitsofmeasure",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    code = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    isactive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_unitsofmeasure", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "user",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: true),
                    email = table.Column<string>(type: "text", nullable: true),
                    image = table.Column<string>(type: "text", nullable: true),
                    password = table.Column<string>(type: "text", nullable: true),
                    role = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("id", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "vesselcategories",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    isactive = table.Column<bool>(type: "boolean", nullable: false),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    createdate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_vesselcategories", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "vesselgrades",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    vesselid = table.Column<long>(type: "bigint", nullable: false),
                    gradeid = table.Column<long>(type: "bigint", nullable: false),
                    uomid = table.Column<int>(type: "integer", nullable: false),
                    type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    gradename = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_vesselgrades", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "vessels",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    imo = table.Column<int>(type: "integer", maxLength: 50, nullable: true),
                    dwt = table.Column<int>(type: "integer", maxLength: 50, nullable: true),
                    type = table.Column<long>(type: "bigint", maxLength: 100, nullable: true),
                    runningcost = table.Column<int>(type: "integer", maxLength: 100, nullable: true),
                    vesseljson = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_vessels", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "vesseltypes",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    category = table.Column<int>(type: "integer", nullable: false),
                    calctype = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    isactive = table.Column<bool>(type: "boolean", nullable: false),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    createdate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_vesseltypes", x => x.id);
                });

            migrationBuilder.InsertData(
                table: "grade",
                columns: new[] { "id", "createdat", "inuse", "name", "price" },
                values: new object[,]
                {
                    { 1L, new DateTime(2025, 8, 21, 10, 37, 14, 333, DateTimeKind.Utc).AddTicks(2844), true, "HSFO", 45m },
                    { 2L, new DateTime(2025, 8, 21, 10, 37, 14, 333, DateTimeKind.Utc).AddTicks(2848), true, "MGO", 34m },
                    { 3L, new DateTime(2025, 8, 21, 10, 37, 14, 333, DateTimeKind.Utc).AddTicks(2850), true, "VLSFO", 89m }
                });

            migrationBuilder.InsertData(
                table: "vesselcategories",
                columns: new[] { "id", "createdate", "createdby", "isactive", "name", "updatedate", "updatedby" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 8, 21, 10, 37, 14, 333, DateTimeKind.Utc).AddTicks(2665), null, true, "Bulk Carrier", null, null },
                    { 2, new DateTime(2025, 8, 21, 10, 37, 14, 333, DateTimeKind.Utc).AddTicks(2674), null, true, "Tanker", null, null },
                    { 3, new DateTime(2025, 8, 21, 10, 37, 14, 333, DateTimeKind.Utc).AddTicks(2676), null, true, "Container", null, null },
                    { 4, new DateTime(2025, 8, 21, 10, 37, 14, 333, DateTimeKind.Utc).AddTicks(2678), null, true, "Gas Carrier", null, null },
                    { 5, new DateTime(2025, 8, 21, 10, 37, 14, 333, DateTimeKind.Utc).AddTicks(2679), null, true, "General Cargo", null, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_grade_name",
                table: "grade",
                column: "name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "commodities");

            migrationBuilder.DropTable(
                name: "configurations");

            migrationBuilder.DropTable(
                name: "currencytype");

            migrationBuilder.DropTable(
                name: "estimates");

            migrationBuilder.DropTable(
                name: "grade");

            migrationBuilder.DropTable(
                name: "ports");

            migrationBuilder.DropTable(
                name: "sndistance");

            migrationBuilder.DropTable(
                name: "unitsofmeasure");

            migrationBuilder.DropTable(
                name: "user");

            migrationBuilder.DropTable(
                name: "vesselcategories");

            migrationBuilder.DropTable(
                name: "vesselgrades");

            migrationBuilder.DropTable(
                name: "vessels");

            migrationBuilder.DropTable(
                name: "vesseltypes");
        }
    }
}
