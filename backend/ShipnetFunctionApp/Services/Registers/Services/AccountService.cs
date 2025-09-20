using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ShipnetFunctionApp.Auth.Services;
using ShipnetFunctionApp.Data;
using ShipnetFunctionApp.Data.Models.Registers;
using ShipnetFunctionApp.Services.Registers.DTOs;
using ShipnetFunctionApp.Services;

namespace ShipnetFunctionApp.Registers.Services
{
    public class AccountService : BaseService
    {
        public AccountService(
            Func<string, MultiTenantSnContext> dbContextFactory,
            ITenantContext tenantContext,
            ILogger<AccountService>? logger = null)
            : base(dbContextFactory, tenantContext, logger)
        {
        }

        public async Task<List<AccountDto>> GetAllAsync()
        {
            var accounts = await _context.Accounts
                .Include(x => x.AccountGroup)
                .OrderBy(x => x.AccountNumber)
                .ToListAsync();

            return accounts.Select(x => new AccountDto
            {
                Id = x.Id,
                AccountNumber = x.AccountNumber,
                AccountName = x.AccountName,
                ExternalAccountNumber = x.ExternalAccountNumber,
                LedgerType = x.LedgerType,
                Dimension = x.Dimension,
                Currency = x.Currency,
                CurrencyCode = x.CurrencyCode,
                Status = x.Status,
                Type = x.Type,
                AccountGroupId = x.AccountGroupId,
                AccountGroupName = x.AccountGroup?.Level1Name
            }).ToList();
        }

        public async Task<AccountDto?> GetByIdAsync(int id)
        {
            var account = await _context.Accounts
                .Include(x => x.AccountGroup)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (account == null) return null;

            return new AccountDto
            {
                Id = account.Id,
                AccountNumber = account.AccountNumber,
                AccountName = account.AccountName,
                ExternalAccountNumber = account.ExternalAccountNumber,
                LedgerType = account.LedgerType,
                Dimension = account.Dimension,
                Currency = account.Currency,
                CurrencyCode = account.CurrencyCode,
                Status = account.Status,
                Type = account.Type,
                AccountGroupId = account.AccountGroupId,
                AccountGroupName = account.AccountGroup?.Level1Name
            };
        }

        public async Task<AccountDto> CreateAsync(AccountDto dto)
        {
            // Final check for duplicate account number
            if (!string.IsNullOrEmpty(dto.AccountNumber))
            {
                var exists = await _context.Accounts
                    .AnyAsync(a => a.AccountNumber == dto.AccountNumber);
                
                if (exists)
                {
                    throw new InvalidOperationException($"Account number '{dto.AccountNumber}' already exists.");
                }
            }

            var account = new Account
            {
                AccountNumber = dto.AccountNumber,
                AccountName = dto.AccountName,
                ExternalAccountNumber = dto.ExternalAccountNumber,
                LedgerType = dto.LedgerType,
                Dimension = dto.Dimension,
                Currency = dto.Currency,
                CurrencyCode = dto.CurrencyCode,
                Status = dto.Status,
                Type = dto.Type,
                AccountGroupId = dto.AccountGroupId
            };

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            // Reload with AccountGroup for response
            await _context.Entry(account)
                .Reference(x => x.AccountGroup)
                .LoadAsync();

            return new AccountDto
            {
                Id = account.Id,
                AccountNumber = account.AccountNumber,
                AccountName = account.AccountName,
                ExternalAccountNumber = account.ExternalAccountNumber,
                LedgerType = account.LedgerType,
                Dimension = account.Dimension,
                Currency = account.Currency,
                CurrencyCode = account.CurrencyCode,
                Status = account.Status,
                Type = account.Type,
                AccountGroupId = account.AccountGroupId,
                AccountGroupName = account.AccountGroup?.Level1Name
            };
        }

        public async Task<AccountDto?> UpdateAsync(int id, AccountDto dto)
        {
            var account = await _context.Accounts
                .Include(x => x.AccountGroup)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (account == null) return null;

            account.AccountNumber = dto.AccountNumber;
            account.AccountName = dto.AccountName;
            account.ExternalAccountNumber = dto.ExternalAccountNumber;
            account.LedgerType = dto.LedgerType;
            account.Dimension = dto.Dimension;
            account.Currency = dto.Currency;
            account.CurrencyCode = dto.CurrencyCode;
            account.Status = dto.Status;
            account.Type = dto.Type;
            account.AccountGroupId = dto.AccountGroupId;

            await _context.SaveChangesAsync();

            // Reload AccountGroup if it changed
            if (dto.AccountGroupId != account.AccountGroupId)
            {
                await _context.Entry(account)
                    .Reference(x => x.AccountGroup)
                    .LoadAsync();
            }

            return new AccountDto
            {
                Id = account.Id,
                AccountNumber = account.AccountNumber,
                AccountName = account.AccountName,
                ExternalAccountNumber = account.ExternalAccountNumber,
                LedgerType = account.LedgerType,
                Dimension = account.Dimension,
                Currency = account.Currency,
                CurrencyCode = account.CurrencyCode,
                Status = account.Status,
                Type = account.Type,
                AccountGroupId = account.AccountGroupId,
                AccountGroupName = account.AccountGroup?.Level1Name
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(x => x.Id == id);

            if (account == null) return false;

            _context.Accounts.Remove(account);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AccountNumberExistsAsync(string accountNumber, int? excludeId = null)
        {
            var query = _context.Accounts.Where(x => x.AccountNumber == accountNumber);
            
            if (excludeId.HasValue)
                query = query.Where(x => x.Id != excludeId.Value);

            return await query.AnyAsync();
        }

        public async Task<List<AccountDto>> GetByAccountGroupAsync(int accountGroupId)
        {
            var accounts = await _context.Accounts
                .Include(x => x.AccountGroup)
                .Where(x => x.AccountGroupId == accountGroupId)
                .OrderBy(x => x.AccountNumber)
                .ToListAsync();

            return accounts.Select(x => new AccountDto
            {
                Id = x.Id,
                AccountNumber = x.AccountNumber,
                AccountName = x.AccountName,
                ExternalAccountNumber = x.ExternalAccountNumber,
                LedgerType = x.LedgerType,
                Dimension = x.Dimension,
                Currency = x.Currency,
                CurrencyCode = x.CurrencyCode,
                Status = x.Status,
                Type = x.Type,
                AccountGroupId = x.AccountGroupId,
                AccountGroupName = x.AccountGroup?.Level1Name
            }).ToList();
        }
    }
}
