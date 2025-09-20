# PowerShell script to generate EF Core migrations for both AdminContext and MultiTenantSnContext

param(
    [Parameter(Mandatory=$true)]
    [string]$MigrationName
)

Write-Host "Generating migration for AdminContext: $MigrationName"
dotnet ef migrations add $MigrationName --context AdminContext --output-dir Data/Migrations/AdminMigrations

Write-Host "Generating migration for MultiTenantSnContext: $MigrationName"
dotnet ef migrations add $MigrationName --context MultiTenantSnContext --output-dir Data/Migrations/TenantMigrations

Write-Host "Migrations generated successfully"