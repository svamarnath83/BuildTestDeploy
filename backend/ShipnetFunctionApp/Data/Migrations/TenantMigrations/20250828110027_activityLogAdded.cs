using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ShipnetFunctionApp.Data.Migrations.TenantMigrations
{
    /// <inheritdoc />
    public partial class activityLogAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "activitylog",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    moduleid = table.Column<int>(type: "integer", nullable: false),
                    recordid = table.Column<long>(type: "bigint", nullable: false),
                    activityname = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    assignedto = table.Column<long>(type: "bigint", nullable: true),
                    status = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    duedate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    createdby = table.Column<long>(type: "bigint", nullable: true),
                    createddate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    additionaldata = table.Column<string>(type: "text", nullable: true),
                    notes = table.Column<string>(type: "text", nullable: true),
                    summary = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_activitylog", x => x.id);
                });

            migrationBuilder.UpdateData(
                table: "grades",
                keyColumn: "id",
                keyValue: 1L,
                column: "createdat",
                value: new DateTime(2025, 8, 28, 16, 30, 26, 933, DateTimeKind.Local).AddTicks(9632));

            migrationBuilder.UpdateData(
                table: "grades",
                keyColumn: "id",
                keyValue: 2L,
                column: "createdat",
                value: new DateTime(2025, 8, 28, 16, 30, 26, 933, DateTimeKind.Local).AddTicks(9635));

            migrationBuilder.UpdateData(
                table: "grades",
                keyColumn: "id",
                keyValue: 3L,
                column: "createdat",
                value: new DateTime(2025, 8, 28, 16, 30, 26, 933, DateTimeKind.Local).AddTicks(9638));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 1,
                column: "createdate",
                value: new DateTime(2025, 8, 28, 16, 30, 26, 933, DateTimeKind.Local).AddTicks(9424));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 2,
                column: "createdate",
                value: new DateTime(2025, 8, 28, 16, 30, 26, 933, DateTimeKind.Local).AddTicks(9447));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 3,
                column: "createdate",
                value: new DateTime(2025, 8, 28, 16, 30, 26, 933, DateTimeKind.Local).AddTicks(9449));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 4,
                column: "createdate",
                value: new DateTime(2025, 8, 28, 16, 30, 26, 933, DateTimeKind.Local).AddTicks(9451));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 5,
                column: "createdate",
                value: new DateTime(2025, 8, 28, 16, 30, 26, 933, DateTimeKind.Local).AddTicks(9453));

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 28, 16, 30, 26, 933, DateTimeKind.Local).AddTicks(9804), new DateTime(2025, 8, 28, 16, 30, 26, 933, DateTimeKind.Local).AddTicks(9805) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 2L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 28, 16, 30, 26, 933, DateTimeKind.Local).AddTicks(9808), new DateTime(2025, 8, 28, 16, 30, 26, 933, DateTimeKind.Local).AddTicks(9809) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 3L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 28, 16, 30, 26, 933, DateTimeKind.Local).AddTicks(9770), new DateTime(2025, 8, 28, 16, 30, 26, 933, DateTimeKind.Local).AddTicks(9771) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 4L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 28, 16, 30, 26, 933, DateTimeKind.Local).AddTicks(9776), new DateTime(2025, 8, 28, 16, 30, 26, 933, DateTimeKind.Local).AddTicks(9777) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 5L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 28, 16, 30, 26, 933, DateTimeKind.Local).AddTicks(9780), new DateTime(2025, 8, 28, 16, 30, 26, 933, DateTimeKind.Local).AddTicks(9781) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 6L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 28, 16, 30, 26, 933, DateTimeKind.Local).AddTicks(9784), new DateTime(2025, 8, 28, 16, 30, 26, 933, DateTimeKind.Local).AddTicks(9785) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 7L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 28, 16, 30, 26, 933, DateTimeKind.Local).AddTicks(9788), new DateTime(2025, 8, 28, 16, 30, 26, 933, DateTimeKind.Local).AddTicks(9789) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 8L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 28, 16, 30, 26, 933, DateTimeKind.Local).AddTicks(9792), new DateTime(2025, 8, 28, 16, 30, 26, 933, DateTimeKind.Local).AddTicks(9793) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 9L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 28, 16, 30, 26, 933, DateTimeKind.Local).AddTicks(9796), new DateTime(2025, 8, 28, 16, 30, 26, 933, DateTimeKind.Local).AddTicks(9797) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 10L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 28, 16, 30, 26, 933, DateTimeKind.Local).AddTicks(9800), new DateTime(2025, 8, 28, 16, 30, 26, 933, DateTimeKind.Local).AddTicks(9801) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "activitylog");

            migrationBuilder.UpdateData(
                table: "grades",
                keyColumn: "id",
                keyValue: 1L,
                column: "createdat",
                value: new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(7955));

            migrationBuilder.UpdateData(
                table: "grades",
                keyColumn: "id",
                keyValue: 2L,
                column: "createdat",
                value: new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(7959));

            migrationBuilder.UpdateData(
                table: "grades",
                keyColumn: "id",
                keyValue: 3L,
                column: "createdat",
                value: new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(7961));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 1,
                column: "createdate",
                value: new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(7761));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 2,
                column: "createdate",
                value: new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(7784));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 3,
                column: "createdate",
                value: new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(7786));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 4,
                column: "createdate",
                value: new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(7788));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 5,
                column: "createdate",
                value: new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(7790));

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8125), new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8125) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 2L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8128), new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8129) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 3L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8092), new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8094) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 4L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8098), new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8099) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 5L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8102), new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8103) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 6L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8106), new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8107) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 7L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8110), new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8111) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 8L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8113), new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8114) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 9L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8117), new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8118) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 10L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8121), new DateTime(2025, 8, 26, 18, 38, 8, 466, DateTimeKind.Local).AddTicks(8122) });
        }
    }
}
