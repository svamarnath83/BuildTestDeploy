using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ShipnetFunctionApp.Auth.Services;
using ShipnetFunctionApp.Data;
using ShipnetFunctionApp.Data.Models.Registers;
using ShipnetFunctionApp.Services.Registers.DTOs;
using ShipnetFunctionApp.Services;

namespace ShipnetFunctionApp.Registers.Services
{
    public class AccountGroupService : BaseService
    {
        public AccountGroupService(
            Func<string, MultiTenantSnContext> dbContextFactory,
            ITenantContext tenantContext,
            ILogger<AccountGroupService>? logger = null)
            : base(dbContextFactory, tenantContext, logger)
        {
        }

        public async Task<List<AccountGroupDto>> GetAllAsync()
        {
            _logger?.LogInformation("AccountGroupService.GetAllAsync() called");
            try
            {
                _logger?.LogInformation("Querying AccountGroups from database");
                var accountGroups = await _context.AccountGroups
                    .OrderBy(x => x.GroupCode)
                    .ToListAsync();

                _logger?.LogInformation("Retrieved {Count} account groups from database", accountGroups?.Count ?? 0);
                
                var result = accountGroups.Select(x => new AccountGroupDto
                {
                    Id = x.Id,
                    ActType = x.ActType, // Map ActType
                    Level1Name = x.Level1Name,
                    Level1Code = x.Level1Code,
                    Level2Name = x.Level2Name,
                    Level2Code = x.Level2Code,
                    Level3Name = x.Level3Name,
                    Level3Code = x.Level3Code,
                    GroupCode = x.GroupCode,
                    Description = x.Description,
                    IfrsReference = x.IfrsReference,
                    SaftCode = x.SaftCode
                }).ToList();

                _logger?.LogInformation("Mapped {Count} account groups to DTOs", result.Count);
                return result;
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error in AccountGroupService.GetAllAsync(): {Message}", ex.Message);
                throw;
            }
        }

        public async Task<AccountGroupDto?> GetByIdAsync(int id)
        {
            var accountGroup = await _context.AccountGroups
                .FirstOrDefaultAsync(x => x.Id == id);

            if (accountGroup == null) return null;

            return new AccountGroupDto
            {
                Id = accountGroup.Id,
                ActType = accountGroup.ActType, // Map ActType
                Level1Name = accountGroup.Level1Name,
                Level1Code = accountGroup.Level1Code,
                Level2Name = accountGroup.Level2Name,
                Level2Code = accountGroup.Level2Code,
                Level3Name = accountGroup.Level3Name,
                Level3Code = accountGroup.Level3Code,
                GroupCode = accountGroup.GroupCode,
                Description = accountGroup.Description,
                IfrsReference = accountGroup.IfrsReference,
                SaftCode = accountGroup.SaftCode
            };
        }

        public async Task<AccountGroupDto> CreateAsync(AccountGroupDto dto)
        {
            var entity = MapToEntity(dto);
            // clear Id to ensure DB assigns a new value
            entity.Id = 0;
            await _context.AccountGroups.AddAsync(entity);
            await _context.SaveChangesAsync();
            return MapToDto(entity);
        }

        public async Task<AccountGroupDto?> UpdateAsync(int id, AccountGroupDto dto)
        {
            var accountGroup = await _context.AccountGroups.FirstOrDefaultAsync(x => x.Id == id);

            if (accountGroup == null) return null;

            accountGroup.ActType = dto.ActType; // Update ActType
            accountGroup.Level1Name = dto.Level1Name;
            accountGroup.Level1Code = dto.Level1Code;
            accountGroup.Level2Name = dto.Level2Name;
            accountGroup.Level2Code = dto.Level2Code;
            accountGroup.Level3Name = dto.Level3Name;
            accountGroup.Level3Code = dto.Level3Code;
            accountGroup.GroupCode = dto.GroupCode;
            accountGroup.Description = dto.Description;
            accountGroup.IfrsReference = dto.IfrsReference;
            accountGroup.SaftCode = dto.SaftCode;

            await _context.SaveChangesAsync();

            return new AccountGroupDto
            {
                Id = accountGroup.Id,
                ActType = accountGroup.ActType, // Map ActType
                Level1Name = accountGroup.Level1Name,
                Level1Code = accountGroup.Level1Code,
                Level2Name = accountGroup.Level2Name,
                Level2Code = accountGroup.Level2Code,
                Level3Name = accountGroup.Level3Name,
                Level3Code = accountGroup.Level3Code,
                GroupCode = accountGroup.GroupCode,
                Description = accountGroup.Description,
                IfrsReference = accountGroup.IfrsReference,
                SaftCode = accountGroup.SaftCode
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var accountGroup = await _context.AccountGroups.FirstOrDefaultAsync(x => x.Id == id);

            if (accountGroup == null) return false;

            _context.AccountGroups.Remove(accountGroup);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> GroupCodeExistsAsync(string groupCode, int? excludeId = null)
        {
            var query = _context.AccountGroups.Where(x => x.GroupCode == groupCode);
            
            if (excludeId.HasValue)
                query = query.Where(x => x.Id != excludeId.Value);

            return await query.AnyAsync();
        }

        // Add these mapping helpers if they don't exist
        private AccountGroup MapToEntity(AccountGroupDto dto)
        {
            return new AccountGroup
            {
                // Id intentionally not set here (leave for DB/creator to control)
                ActType = dto.ActType,
                GroupCode = dto.GroupCode,
                Description = dto.Description,
                Level1Name = dto.Level1Name,
                Level1Code = dto.Level1Code,
                Level2Name = dto.Level2Name,
                Level2Code = dto.Level2Code,
                Level3Name = dto.Level3Name,
                Level3Code = dto.Level3Code,
                IfrsReference = dto.IfrsReference,
                SaftCode = dto.SaftCode
            };
        }

        private AccountGroupDto MapToDto(AccountGroup entity)
        {
            return new AccountGroupDto
            {
                Id = entity.Id,
                ActType = entity.ActType,
                GroupCode = entity.GroupCode,
                Description = entity.Description,
                Level1Name = entity.Level1Name,
                Level1Code = entity.Level1Code,
                Level2Name = entity.Level2Name,
                Level2Code = entity.Level2Code,
                Level3Name = entity.Level3Name,
                Level3Code = entity.Level3Code,
                IfrsReference = entity.IfrsReference,
                SaftCode = entity.SaftCode
            };
        }
    }
}