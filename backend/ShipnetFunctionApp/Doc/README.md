# ShipnetFunctionApp - Getting Started

This guide explains how to run the application locally and initialize tenant schemas.

## Prerequisites
- .NET 8 SDK
- PostgreSQL instance reachable from your machine
- Visual Studio 2022 or `dotnet` CLI

## 1) Configure the database connection
Update the connection string in `local.settings.json`:
- Key: `DefaultConnection`
- Example:
- "DefaultConnection": "Host=localhost;Port=5432;Database=voyage;Username=postgres;Password=postgres"

## 2) Start the application
Run the project. On first run:
- The admin (public) schema is created.
- Admin tables (e.g., subscriptions) are created under `public`.

The Functions host listens by default on:
- http://localhost:7071

## 3) Add a subscription (tenant) record
Insert a row into the `public.subscriptions` table with:
- username
- accountcode
- schema (must be unique and not `public`)

Example SQL:
INSERT INTO public.subscriptions (name, accountcode, schema) VALUES ('admin', 'acme', 'acme');

## 4) Create and migrate the tenant schema
Option A: Call the migration endpoint to create the tenant schema and apply all tables:
- POST http://localhost:7071/api/migrations/tenant/create/{schema}
- Example: http://localhost:7071/api/migrations/tenant/create/acme

Option B: Restart the application to trigger migrations on startup.

This will:
- Create the schema if missing
- Apply tenant tables into that schema

## 5) Add a user to the tenant
Manually insert a user into the tenant’s `user` table:
INSERT INTO acme."user" (name, email, password, role) VALUES ('Admin', 'admin@example.com', 'admin', 'Admin');

## 6) Login
Login to the application with:
- The credentials you inserted in the tenant’s `user` table
- The `accountcode` you inserted in `public.subscriptions`

## Useful endpoints
- Migrate all: POST http://localhost:7071/api/migrations/all
- Migrate tenant: POST http://localhost:7071/api/migrations/tenant/{schema}
- Create + migrate tenant: POST http://localhost:7071/api/migrations/tenant/create/{schema}

## Troubleshooting
- Verify `DefaultConnection` is correct and PostgreSQL is reachable.
- Check the Functions logs for migration errors.
- Ensure the schema name contains only letters, numbers, and underscores.
- If tables aren’t created for the tenant, re-run the create endpoint or restart the app.