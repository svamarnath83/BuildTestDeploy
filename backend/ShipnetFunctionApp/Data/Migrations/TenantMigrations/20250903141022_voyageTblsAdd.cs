using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ShipnetFunctionApp.Data.Migrations.TenantMigrations
{
    /// <inheritdoc />
    public partial class voyageTblsAdd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "voyagecargos",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    voyageid = table.Column<long>(type: "bigint", nullable: true),
                    chartererid = table.Column<long>(type: "bigint", nullable: true),
                    commodityid = table.Column<int>(type: "integer", nullable: true),
                    rate = table.Column<decimal>(type: "numeric(18,4)", nullable: true),
                    ratetypeid = table.Column<int>(type: "integer", nullable: true),
                    qty = table.Column<decimal>(type: "numeric(18,3)", nullable: true),
                    uomid = table.Column<int>(type: "integer", nullable: true),
                    loadports = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    dischargeports = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    cargodescription = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    laycanstart = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    laycanend = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    commissionrate = table.Column<decimal>(type: "numeric(5,2)", nullable: true),
                    terms = table.Column<string>(type: "text", nullable: true),
                    notes = table.Column<string>(type: "text", nullable: true),
                    isactive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    createdat = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updatedat = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_voyagecargos", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "voyageheaders",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    vesselid = table.Column<long>(type: "bigint", nullable: false),
                    voyageno = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    voyagetypeid = table.Column<int>(type: "integer", nullable: true),
                    estimateid = table.Column<long>(type: "bigint", nullable: true),
                    status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    voyagestartdate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    voyageenddate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    additionaldata = table.Column<string>(type: "text", nullable: true),
                    createdby = table.Column<long>(type: "bigint", nullable: true),
                    updatedby = table.Column<long>(type: "bigint", nullable: true),
                    createdat = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updatedat = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_voyageheaders", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "voyageportrotations",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    portid = table.Column<long>(type: "bigint", nullable: true),
                    arrivaldate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    departuredate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    portcost = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
                    cargocost = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
                    agentid = table.Column<long>(type: "bigint", nullable: true),
                    porttypeid = table.Column<int>(type: "integer", nullable: true),
                    timeofbert = table.Column<decimal>(type: "numeric(10,2)", nullable: true),
                    distance = table.Column<decimal>(type: "numeric(10,2)", nullable: true),
                    voyageid = table.Column<long>(type: "bigint", nullable: true),
                    sequenceorder = table.Column<int>(type: "integer", nullable: true),
                    notes = table.Column<string>(type: "text", nullable: true),
                    isactive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    createdat = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    updatedat = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_voyageportrotations", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_voyagecargos_chartererid",
                table: "voyagecargos",
                column: "chartererid");

            migrationBuilder.CreateIndex(
                name: "IX_voyagecargos_commodityid",
                table: "voyagecargos",
                column: "commodityid");

            migrationBuilder.CreateIndex(
                name: "IX_voyagecargos_isactive",
                table: "voyagecargos",
                column: "isactive");

            migrationBuilder.CreateIndex(
                name: "IX_voyagecargos_voyageid",
                table: "voyagecargos",
                column: "voyageid");

            migrationBuilder.CreateIndex(
                name: "IX_voyageportrotations_isactive",
                table: "voyageportrotations",
                column: "isactive");

            migrationBuilder.CreateIndex(
                name: "IX_voyageportrotations_portid",
                table: "voyageportrotations",
                column: "portid");

            migrationBuilder.CreateIndex(
                name: "IX_voyageportrotations_voyage_sequence",
                table: "voyageportrotations",
                columns: new[] { "voyageid", "sequenceorder" });

            migrationBuilder.CreateIndex(
                name: "IX_voyageportrotations_voyageid",
                table: "voyageportrotations",
                column: "voyageid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "voyagecargos");

            migrationBuilder.DropTable(
                name: "voyageheaders");

            migrationBuilder.DropTable(
                name: "voyageportrotations");
        }
    }
}
