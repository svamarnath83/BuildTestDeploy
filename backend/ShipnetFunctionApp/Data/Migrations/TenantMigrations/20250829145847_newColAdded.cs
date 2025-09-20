using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShipnetFunctionApp.Data.Migrations.TenantMigrations
{
    /// <inheritdoc />
    public partial class newColAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "parentid",
                table: "activitylog",
                type: "bigint",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "grades",
                keyColumn: "id",
                keyValue: 1L,
                column: "createdat",
                value: new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4695));

            migrationBuilder.UpdateData(
                table: "grades",
                keyColumn: "id",
                keyValue: 2L,
                column: "createdat",
                value: new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4699));

            migrationBuilder.UpdateData(
                table: "grades",
                keyColumn: "id",
                keyValue: 3L,
                column: "createdat",
                value: new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4701));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 1,
                column: "createdate",
                value: new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4468));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 2,
                column: "createdate",
                value: new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4492));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 3,
                column: "createdate",
                value: new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4494));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 4,
                column: "createdate",
                value: new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4497));

            migrationBuilder.UpdateData(
                table: "vesselcategories",
                keyColumn: "id",
                keyValue: 5,
                column: "createdate",
                value: new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4498));

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 1L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4869), new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4870) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 2L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4873), new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4874) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 3L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4836), new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4838) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 4L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4842), new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4843) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 5L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4846), new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4847) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 6L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4850), new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4851) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 7L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4854), new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4855) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 8L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4857), new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4859) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 9L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4861), new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4862) });

            migrationBuilder.UpdateData(
                table: "vesseltypes",
                keyColumn: "id",
                keyValue: 10L,
                columns: new[] { "createdate", "updatedate" },
                values: new object[] { new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4865), new DateTime(2025, 8, 29, 20, 28, 47, 279, DateTimeKind.Local).AddTicks(4866) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "parentid",
                table: "activitylog");

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
    }
}
