Here’s a clean **Markdown document** version of your steps:

````markdown
# Steps to Add a New Model and Run Migrations

## 1. Create Model
- Create the **Model class** inside the respective folder:
  - `Data/Model/Operation`
  - `Data/Model/Accounting`
  - etc.

## 2. Create Model Configuration
- Create the **Model Configuration class** in the `model` folder.

## 3. Register in Context
- Add the model and its configuration in the **DbContext**.

### Context Types
- **If the model is added for Admin:**
  - Use `AdminContext.cs`
- **If the model is added for Multi-tenant:**
  - Use `MultiTenantSnContext.cs`

---

## 4. Add Migration

1. Open **PowerShell** in the `shipnetfunctionapp` project.
2. Run the appropriate migration command depending on the context.

### For Admin Context
- **Syntax:**
  ```sh
  dotnet ef migrations add $MigrationName --context AdminContext --output-dir Data/Migrations/AdminMigrations
````

* **Example:**

  ```sh
  dotnet ef migrations add confTblAdd --context AdminContext --output-dir Data/Migrations/AdminMigrations
  ```

### For MultiTenant Context

* **Syntax:**

  ```sh
  dotnet ef migrations add $MigrationName --context MultiTenantSnContext --output-dir Data/Migrations/TenantMigrations
  ```
* **Example:**

  ```sh
  dotnet ef migrations add accTblAddMigChanged --context MultiTenantSnContext --output-dir Data/Migrations/TenantMigrations
  ```

```
### Restart the function App to update these changes in Database

```