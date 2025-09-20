using Microsoft.EntityFrameworkCore;
using ShipnetFunctionApp.Auth.Services;
using ShipnetFunctionApp.Chartering.DTOs;
using ShipnetFunctionApp.Data;
using ShipnetFunctionApp.Data.Models;
using ShipnetFunctionApp.Services;

namespace ShipnetFunctionApp.Chartering.Services
{
    public class EstimateService : BaseService
    {
        public EstimateService(
            Func<string, MultiTenantSnContext> dbContextFactory,
            ITenantContext tenantContext
            )
            : base(dbContextFactory, tenantContext)
        {
        }

        public async Task<IEnumerable<EstimateDto>> GetEstimatesAsync()
        {
            return await _context.Estimates
                .OrderBy(e => e.EstimateDate)
                .Select(e => new EstimateDto
                {
                    id = e.Id,
                    estimateNo = e.EstimateNo,
                    estimateDate = e.EstimateDate,
                    shipType = e.ShipType,
                    ship = e.Ship,
                    commodity = e.Commodity,
                    loadPorts = e.LoadPorts,
                    dischargePorts = e.DischargePorts,
                    status = e.Status,
                    voyageNo = e.VoyageNo,
                    shipAnalysis = e.ShipAnalysis
                })
                .ToListAsync();
        }

        public async Task<EstimateDto?> GetEstimateByIdAsync(long id)
        {
            var e = await _context.Estimates.FindAsync(id);
            if (e == null)
            {
                return null;
            }
            return new EstimateDto
            {
                id = e.Id,
                estimateNo = e.EstimateNo,
                estimateDate = e.EstimateDate,
                shipType = e.ShipType,
                ship = e.Ship,
                commodity = e.Commodity,
                loadPorts = e.LoadPorts,
                dischargePorts = e.DischargePorts,
                status = e.Status,
                voyageNo = e.VoyageNo,
                shipAnalysis = e.ShipAnalysis
            };
        }

        public async Task<EstimateDto> AddOrUpdateEstimateAsync(EstimateDto dto)
        {
            Estimate? entity = null;
            if (dto.id > 0)
                entity = await _context.Estimates.FindAsync(dto.id);

            if (entity == null)
            {
                entity = new Estimate
                {
                    EstimateNo = dto.estimateNo,
                    EstimateDate = dto.estimateDate,
                    ShipType = dto.shipType,
                    Ship = dto.ship,
                    Commodity = dto.commodity,
                    LoadPorts = dto.loadPorts,
                    DischargePorts = dto.dischargePorts,
                    Status = dto.status,
                    VoyageNo = dto.voyageNo,
                    ShipAnalysis = dto.shipAnalysis
                };
                _context.Estimates.Add(entity);
            }
            else
            {
                entity.EstimateNo = dto.estimateNo;
                entity.EstimateDate = dto.estimateDate;
                entity.ShipType = dto.shipType;
                entity.Ship = dto.ship;
                entity.Commodity = dto.commodity;
                entity.LoadPorts = dto.loadPorts;
                entity.DischargePorts = dto.dischargePorts;
                entity.Status = dto.status;
                entity.VoyageNo = dto.voyageNo;
                entity.ShipAnalysis = dto.shipAnalysis;
            }

            await _context.SaveChangesAsync();
            dto.id = entity.Id;
            return dto;
        }

        public async Task<bool> DeleteEstimateAsync(long id)
        {
            var entity = await _context.Estimates.FindAsync(id);
            if (entity == null)
            {
                return false;
            }
            _context.Estimates.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
