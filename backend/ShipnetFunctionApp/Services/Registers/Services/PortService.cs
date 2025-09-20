

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ShipnetFunctionApp.Auth.Services;
using ShipnetFunctionApp.Data;
using ShipnetFunctionApp.Data.Models;
using ShipnetFunctionApp.Registers.DTOs;
using ShipnetFunctionApp.Services;

namespace ShipnetFunctionApp.Registers.Services
{
    /// <summary>
    /// Service for port query operations. Handles all read-only and CRUD port data retrieval with efficient querying.
    /// </summary>
    public class PortService : BaseService
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="PortService"/> class.
        /// </summary>
        public PortService(
            Func<string, MultiTenantSnContext> dbContextFactory,
            ITenantContext tenantContext
            ) : base(dbContextFactory, tenantContext)
        {
        }        /// <summary>
                 /// Gets all ports ordered by name.
                 /// </summary>
                 /// <returns>List of port DTOs.</returns>
        public async Task<IEnumerable<PortDto>> GetPortsAsync()
        {
            var ports = await _context.Ports
                .OrderByDescending(p => p.rankOrder)
                .Select(p => new PortDto
                {
                    Id = p.Id,
                    PortCode = p.PortCode ?? string.Empty,
                    Name = p.Name ?? string.Empty,
                    unctadCode = p.Unctad,
                    netpasCode = p.netpasCode,
                    ets = p.ets,
                    historical = p.Ishistorical,
                    IsActive = p.IsActive,
                    additionalData = p.additionaldata
                })
                .ToListAsync();

            //add IsEurope property mapping
            foreach (var port in ports)
            {
                port.IsEurope = GetIsEuropeFromAdditionalData(port.additionalData);
            }


            return ports;
        }

        /// <summary>
        /// Deletes a port by its ID.
        /// </summary>
        /// <param name="id">Port ID to delete.</param>
        /// <returns>True if deleted, false if not found.</returns>
        public async Task<bool> DeletePortAsync(int id)
        {
            var port = await _context.Ports.FirstOrDefaultAsync(p => p.Id == id);
            if (port == null)
            {
                return false;
            }
            _context.Ports.Remove(port);
            await _context.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Adds a new port or updates an existing port.
        /// </summary>
        /// <param name="portDto">Port DTO to add or update.</param>
        /// <returns>Saved port DTO.</returns>
        public async Task<PortDto> AddOrUpdatePortAsync(PortDto portDto)
        {
            if (portDto == null)
                throw new ArgumentNullException(nameof(portDto));
            Port? portEntity = null;
            if (portDto.Id > 0)
            {
                portEntity = await _context.Ports.FirstOrDefaultAsync(p => p.Id == portDto.Id);
            }
            if (portEntity == null)
            {
                // Add new port
                portEntity = new Port
                {
                    PortCode = portDto.PortCode ?? string.Empty,
                    Name = portDto.Name ?? string.Empty,
                    Unctad = portDto.unctadCode,
                    netpasCode = portDto.netpasCode,
                    ets = portDto.ets,
                    Ishistorical = portDto.historical,
                    IsActive = portDto.IsActive,
                    additionaldata = portDto.additionalData
                };
                _context.Ports.Add(portEntity);
            }
            else
            {
                // Update existing port
                portEntity.PortCode = portDto.PortCode ?? string.Empty;
                portEntity.Name = portDto.Name ?? string.Empty;
                portEntity.Unctad = portDto.unctadCode;
                portEntity.netpasCode = portDto.netpasCode;
                portEntity.ets = portDto.ets;
                portEntity.Ishistorical = portDto.historical;
                portEntity.IsActive = portDto.IsActive;
                portEntity.additionaldata = portDto.additionalData;
            }
            await _context.SaveChangesAsync();
            portDto.Id = portEntity.Id;
            return portDto;
        }

        /// <summary>
        /// Extracts the IsEurope flag from the additionalData JSON property
        /// </summary>
        /// <param name="additionalData">The additional data JSON string</param>
        /// <returns>True if the port is in Europe, false otherwise</returns>
        private bool GetIsEuropeFromAdditionalData(string? additionalData)
        {
            if (string.IsNullOrEmpty(additionalData))
                return false;

            try
            {
                // Parse the JSON string
                var additionalDataObj = System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(additionalData);

                // Check if the europe property exists and return its value
                if (additionalDataObj.TryGetProperty("europe", out var europeValue) && europeValue.ValueKind == System.Text.Json.JsonValueKind.False)
                {
                    return false;
                }
                else if (additionalDataObj.TryGetProperty("europe", out europeValue) && europeValue.ValueKind == System.Text.Json.JsonValueKind.True)
                {
                    return true;
                }
            }
            catch
            {
                // In case of any parsing errors, return false
                return false;
            }

            return false;
        }

        public async Task<IEnumerable<CountryDto>> GetCountryAsync()
        {
            var countries = await _context.Countries
                .OrderByDescending(p => p.Name)
                .Select(p => new CountryDto
                {
                    id = p.Id,
                    code = p.Code ?? string.Empty,
                    name = p.Name ?? string.Empty,

                })
                .ToListAsync();
            return countries;
        }


        /// <summary>
        /// Retrieves a port by its ID.
        /// </summary>
        /// <param name="id">Port ID.</param>
        /// <returns>Port DTO or null if not found.</returns>
        public async Task<PortDto?> GetPortByIdAsync(int id)
        {
            var port = await _context.Ports
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id);
            if (port == null)
            {
                return null;
            }
            return new PortDto
            {
                Id = port.Id,
                PortCode = port.PortCode ?? string.Empty,
                Name = port.Name ?? string.Empty,
                unctadCode = port.Unctad,
                netpasCode = port.netpasCode,
                ets = port.ets,
                historical = port.Ishistorical,
                IsActive = port.IsActive,
                additionalData = port.additionaldata
            };
        }
    }
}
