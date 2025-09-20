using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;
using ShipnetFunctionApp.Auth.Services;
using ShipnetFunctionApp.Data;
using ShipnetFunctionApp.Data.Models;
using ShipnetFunctionApp.Data.Models.Charterering;
using ShipnetFunctionApp.Services;
using ShipnetFunctionApp.VoyageManager.DTOs;
using ShipnetFunctionApp.Services.Operation.DTOs;
using ShipnetFunctionApp.Services.Operation.Services;

namespace ShipnetFunctionApp.Operations.Services
{
    public class VoyageManagerService : BaseService
    {
        private readonly VoyagePortRotationService _portRotationService;
        public VoyageManagerService(
            Func<string, MultiTenantSnContext> dbContextFactory,
            ITenantContext tenantContext,
            VoyagePortRotationService portRotationService
            )
            : base(dbContextFactory, tenantContext)
        {
            _portRotationService = portRotationService;
        }

        public async Task<VesselOverviewDto?> GetVesselOverviewAsync(long vesselId)
        {
            var vessel = await _context.Vessels
                .Where(v => v.Id == vesselId)
                .Select(v => new { v.Id, v.Name, v.Latitude, v.IMO, v.Longitude })
                .FirstOrDefaultAsync();

            if (vessel == null)
                return null;

            var voyageHeader = await GetVoyageHeaderAsync(vesselId);

            if(voyageHeader == null)
                return null;

            var portCalls = await _portRotationService.GetVoyagePortCallslAsync(voyageHeader.Id);

            string fromPort = portCalls.FirstOrDefault(x=>x.activity == "Load")?.portName;
            string toPort = portCalls.LastOrDefault(x => x.activity == "Discharge")?.portName;

            var routes = GetRoutes(voyageHeader.AdditionalData ?? "");

            var vesselOverview = new VesselOverviewDto
            {
                latitude = vessel.Latitude,
                longitude = vessel.Longitude,
                imo = vessel.IMO.ToString(),
                voyage = voyageHeader.Id!=0 ? new VoyageOverviewDto
                {
                    id = voyageHeader.Id,
                    from = fromPort,
                    to = toPort,
                    cargo = string.Empty,
                    route = routes,
                    progress = 0
                } : null,
                portCalls = portCalls
            };

            var mock = BuildMockCrewAndOperations();
            vesselOverview.crew = mock.crew;
            vesselOverview.operations = mock.ops;

            vesselOverview.weather = new WeatherConditionsDto
            {
                location = toPort ?? fromPort ?? "North Atlantic",
                condition = "Partly Cloudy",
                temperature = 17.3,
                windSpeed = 18.4,
                windDirection = "SW",
                waveHeight = 2.1,
                visibility = 8.5,
                pressure = 1013.2,
                forecast = "Light SW winds, slight seas. Chance of showers in 24h.",
                humidity = 72,
                seaState = 3
            };

            vesselOverview.weatherAlerts = new List<WeatherAlertDto>
            {
                new WeatherAlertDto
                {
                    id = Guid.NewGuid().ToString(),
                    type = "advisory",
                    severity = "medium",
                    title = "Moderate Swell",
                    description = "Forecasted 2.5-3.0m swell developing from WSW sector in next 18 hours.",
                    validFrom = DateTime.Now.ToString("o"),
                    validTo = DateTime.Now.AddHours(18).ToString("o"),
                    affectedArea = "Approaches to destination"
                }
            };

            vesselOverview.technical = new VesselTechnicalDetailsDto
            {
                imo = vessel.IMO.ToString(),
                mmsi = "123456789",
                callSign = "CALL123",
                flag = "Panama",
                builder = "Hyundai Heavy Industries",
                yearBuilt = 2012,
                dwt = 82000,
                grt = 51000,
                length = 229.0,
                beam = 32.2,
                draft = 13.5,
                enginePower = 12800,
                maxSpeed = 15.5,
                fuelConsumption = 28.4,
                lastMaintenance = DateTime.Now.AddDays(-40).ToString("o"),
                nextMaintenance = DateTime.Now.AddDays(50).ToString("o"),
                classification = "DNV",
                insuranceExpiry = DateTime.Now.AddMonths(7).ToString("o")
            };

            vesselOverview.performance = new CurrentPerformanceDto
            {
                currentSpeed = portCalls.Where(x => x.activity == "Load").Select(x=> Convert.ToDouble(x.speed)).FirstOrDefault(),
                fuelConsumption = 27.8,
                eta = DateTime.Now.AddHours(96).ToString("o"),
                distanceRemaining = 1380,
                averageSpeed = 13.9,
                fuelEfficiency = 0.0201,
                engineLoad = 72.5,
                rpm = 92,
                powerOutput = 12350,
                fuelType = "VLSFO",
                lastUpdate = DateTime.Now.ToString("o")
            };

            
            vesselOverview.maintenance = new MaintenanceScheduleDto
            {
                vesselId = vessel.Id.ToString(),
                lastDryDock = DateTime.Now.AddMonths(-18).ToString("o"),
                nextDryDock = DateTime.Now.AddMonths(6).ToString("o"),
                lastService = DateTime.Now.AddDays(-30).ToString("o"),
                nextService = DateTime.Now.AddDays(60).ToString("o"),
                maintenanceRecords = new List<MaintenanceRecordDto>
                {
                    new MaintenanceRecordDto { id = Guid.NewGuid().ToString(), type = "scheduled", description = "Main engine quarterly service", performedDate = DateTime.Now.AddDays(-30).ToString("o"), nextDueDate = DateTime.Now.AddDays(60).ToString("o"), status = "completed", cost = 14500, contractor = "MarineTech", location = "At Sea" },
                    new MaintenanceRecordDto { id = Guid.NewGuid().ToString(), type = "inspection", description = "Lifeboat gear inspection", performedDate = DateTime.Now.AddDays(-10).ToString("o"), status = "completed", cost = 1200, contractor = "Crew" },
                    new MaintenanceRecordDto { id = Guid.NewGuid().ToString(), type = "unscheduled", description = "Radar antenna alignment", performedDate = DateTime.Now.AddDays(-5).ToString("o"), status = "completed", cost = 900, contractor = "Port Service" },
                    new MaintenanceRecordDto { id = Guid.NewGuid().ToString(), type = "scheduled", description = "Fuel purifier service", performedDate = DateTime.Now.AddDays(-2).ToString("o"), nextDueDate = DateTime.Now.AddDays(88).ToString("o"), status = "completed", cost = 2100 }
                },
                complianceStatus = new List<ComplianceStatusDto>
                {
                    new ComplianceStatusDto { certificateName = "Safety Management Certificate", certificateNumber = "SMC-2023-001", issuedDate = DateTime.Now.AddMonths(-10).ToString("o"), expiryDate = DateTime.Now.AddMonths(14).ToString("o"), status = "valid", issuingAuthority = "Flag State", renewalRequired = false, daysUntilExpiry = (int)(DateTime.Now.AddMonths(14) - DateTime.Now).TotalDays },
                    new ComplianceStatusDto { certificateName = "International Oil Pollution Prevention", certificateNumber = "IOPP-5582", issuedDate = DateTime.Now.AddYears(-3).ToString("o"), expiryDate = DateTime.Now.AddMonths(5).ToString("o"), status = "expiring", issuingAuthority = "Class Society", renewalRequired = true, daysUntilExpiry = (int)(DateTime.Now.AddMonths(5) - DateTime.Now).TotalDays },
                    new ComplianceStatusDto { certificateName = "Cargo Ship Safety Construction", certificateNumber = "CSC-9911", issuedDate = DateTime.Now.AddYears(-4).ToString("o"), expiryDate = DateTime.Now.AddMonths(-1).ToString("o"), status = "expired", issuingAuthority = "Flag State", renewalRequired = true, daysUntilExpiry = -30 }
                },
                totalMaintenanceCost = 14500 + 1200 + 900 + 2100,
                budgetRemaining = 150000 - (14500 + 1200 + 900 + 2100)
            };

            return vesselOverview;
        }

        private List<List<double>> GetRoutes(string addtionalData)
        {
            var parshedData = JsonConvert.DeserializeObject<VoyageDto>(addtionalData);
            var routes = parshedData.routingPath.Select(rp => new List<double> { Convert.ToDouble(rp.longitude), Convert.ToDouble(rp.latitude) }).ToList();
            return routes;
        }

        public async Task GenerateVoyage(long estimateId)
        {
            var estimate = _context.Estimates.Find(estimateId);

            if (estimate != null)
            {
                var estimateAnalysis = JsonConvert.DeserializeObject<EstimateAnalysisData>(estimate.ShipAnalysis ?? "");

                Console.WriteLine(JsonConvert.SerializeObject(estimateAnalysis, Formatting.Indented));

                //voyage
                var voyageDto = new VoyageDto
                {
                    status = "Active",
                    vesselId = estimateAnalysis.BestShipDetailed.Vessel.Id,
                    voyageNo = 0,
                    estimateId = estimate.Id,
                    voyageType = 0, //Bulk
                    vesselName = estimateAnalysis.BestShipDetailed.Vessel.VesselName
                };

                //cargoes
                estimateAnalysis.BestShipDetailed.Cargoes.ForEach(cargoInput =>
                {
                    var cargo = new VoyageCargoDto
                    {
                        cargoTypeId = 0, //Bulk
                        chartererId = 0,
                        commodityId = 0,
                        loadPorts = string.Join(",", cargoInput.LoadPorts),
                        dischargePorts = string.Join(",", cargoInput.DischargePorts),
                        quantity = (decimal)cargoInput.Quantity,
                        unitTypeId = 0, //MT
                        price = (decimal)cargoInput.Rate,
                        priceTypeId = 0, //Lumpsum
                        commissionPercentage = 0,
                        worldScale = 0,
                        bunkerCompensation = 0,
                        otherIncome = 0,
                        commissionOnDemurrage = false,
                        commissionOnDespatch = false,
                        commissionOnBunkerCompensation = false,
                        commissionOnOtherIncome = false,
                        commissionOnEUETS = false,
                    };

                    voyageDto.cargoList.Add(cargo);
                });

                //portcalls
                var portSeq = 0;
                var voyageWaypoints = new List<RoutingPath>();

                estimateAnalysis.BestShipDetailed.PortCalls.ForEach(portCall =>
                {
                    var portCallDto = new VoyagePortCallDto
                    {
                        sequenceOrder = portSeq,
                        portId = portCall.PortId,
                        portName = portCall.PortName,
                        activity = portCall.Activity,
                        arrival = portCall.Eta,
                        departure = portCall.Etd,
                        distance = portCall.Distance,
                        speed = portCall.Speed,
                        portCost = portCall.PortCost,
                        cargoCost = portCall.CargoCost
                    };

                    voyageDto.portCalls.Add(portCallDto);

                    //routing path
                    if (portCall.DistanceResult?.RoutingPath != null)
                        voyageWaypoints.AddRange(portCall.DistanceResult.RoutingPath);


                    portSeq++;

                    //bunkerconsumption
                    foreach (var bunker in portCall.BunkerConsumption)
                    {
                        var portConsumption = new VoyageBunkerConsumption
                        {
                            portCallId = portCall.Id,
                            gradeId = 0,
                            arrivalQuantity = bunker.ArrivalQuantity,
                            departureQuantity = bunker.DepartureQuantity,
                        };

                        voyageDto.bunkerConsumptions.Add(portConsumption);
                    }
                });

                voyageDto.routingPath = voyageWaypoints;

                //new Voyage No
                long lastVoyageNumber = 0;
                try
                {
                    // VoyageNo stored as string? Try parse all numeric voyage numbers for the vessel
                    var existingNos = await _context.VoyageHeaders
                        .Where(x => x.VesselId == voyageDto.vesselId)
                        .Select(v => v.VoyageNo)
                        .ToListAsync();

                    foreach (var no in existingNos)
                    {
                        if (long.TryParse(no?.ToString(), out var parsed))
                        {
                            if (parsed > lastVoyageNumber) lastVoyageNumber = parsed;
                        }
                    }
                }
                catch { /* ignore */ }
                var newVoyageNo = lastVoyageNumber + 1;

                //Create Voyage
                var voyage = new VoyageHeader
                {
                    Status = voyageDto.status,
                    EstimateId = voyageDto.estimateId,
                    VesselId = voyageDto.vesselId,
                    VoyageNo = newVoyageNo.ToString(),
                    VoyageTypeId = 0, //Bulk
                };

                voyage.VoyageStartDate = voyageDto.portCalls.Min(x => x.departure);
                voyage.VoyageEndDate = voyageDto.portCalls.Max(x => x.departure);

                voyage.AdditionalData = JsonConvert.SerializeObject(voyageDto);

                //print voyage.addittionalData
                Console.WriteLine(JsonConvert.SerializeObject(voyage.AdditionalData, Formatting.Indented));

                _context.VoyageHeaders.Add(voyage);

                //Create Activity Log
                var impactData = new VoyageImpactAnalysisDto
                {
                    startDate = voyage.VoyageStartDate.Value,
                    endDate = voyage.VoyageEndDate.Value,
                    totalDays = (voyage.VoyageEndDate - voyage.VoyageStartDate)?.Days ?? 0,
                    bunkerCons = voyageDto.bunkerConsumptions.Sum(x => x.consumption),
                    carbonCreditExpense = 0, // Calculate as needed
                    bunkerCost = 0, // Calculate as needed
                    netDaily = 100 // Calculate as needed
                };

                var activityLog = new ActivityLog
                {
                    ModuleId = 1, //Voyage Module
                    RecordId = voyage.Id,
                    ActivityName = "Voyage Created",
                    AdditionalData = JsonConvert.SerializeObject(voyageDto),
                    ActivityImpactData = JsonConvert.SerializeObject(impactData)
                };

                _context.ActivityLogs.Add(activityLog);

                estimate.Status = "Generated";

                // Save changes
                await _context.SaveChangesAsync();
            }
        }

        /// <summary>
        /// Get a voyage header entity by id (no extra DTO)
        /// </summary>
        public async Task<VoyageHeader?> GetVoyageHeaderAsync(long vesselId)
        {
            return await _context.VoyageHeaders.Where(h => h.VesselId == vesselId).OrderBy(h => h.Id).LastOrDefaultAsync();
        }

        /// <summary>
        /// Build VoyageDto for a given voyage using voyage header and port rotation service
        /// </summary>
        public async Task<VoyageDto?> GetVoyageByIdAsync(long voyageId)
        {
            var header = await _context.VoyageHeaders
                .Where(h => h.Id == voyageId)
                .Select(h => new
                {
                    h.Id,
                    h.VesselId,
                    h.VoyageNo,
                    h.VoyageTypeId,
                    h.EstimateId,
                    h.Status,
                    h.VoyageStartDate,
                    h.VoyageEndDate,
                    h.AdditionalData,
                    h.CreatedAt,
                    h.UpdatedAt,
                    VesselName = _context.Vessels.Where(v => v.Id == h.VesselId).Select(v => v.Name).FirstOrDefault()
                })
                .FirstOrDefaultAsync();

            if (header == null)
                return null;

            // Always use port rotation service for port calls
            var portCalls = await _portRotationService.GetVoyagePortCallslAsync(voyageId) ?? new List<VoyagePortCallDto>();
            var voyage = JsonConvert.DeserializeObject<VoyageDto>(header.AdditionalData);
            VoyageDto? dto = new VoyageDto();
           
            dto.id = header.Id;
            if (long.TryParse(header.VoyageNo, out var voyageNo)) dto.voyageNo = voyageNo;
            dto.voyageType = header.VoyageTypeId ?? dto.voyageType;
            dto.vesselId = header.VesselId ?? dto.vesselId;
            dto.vesselName = header.VesselName ?? dto.vesselName;
            dto.estimateId = header.EstimateId ?? dto.estimateId;
            dto.status = header.Status ?? dto.status;
            dto.voyageStart = header.VoyageStartDate ?? dto.voyageStart;
            dto.voyageEnd = header.VoyageEndDate ?? dto.voyageEnd;
            dto.portCalls = portCalls;
            dto.bunkerConsumptions = voyage.bunkerConsumptions;
            dto.cargoList = voyage.cargoList;
            dto.extraInfoList = voyage.extraInfoList;
            dto.voyageBunkerings = voyage.voyageBunkerings;

            if (dto.voyageStart.HasValue && dto.voyageEnd.HasValue)
            {
                dto.voyageDuration = (int)(dto.voyageEnd.Value.Date - dto.voyageStart.Value.Date).TotalDays;
            }

            dto.createdAt = header.CreatedAt ?? dto.createdAt;
            dto.updatedAt = header.UpdatedAt ?? dto.updatedAt;

            return dto;
        }

        private (CrewDto crew, OperationsDto ops) BuildMockCrewAndOperations()
        {
            var crew = new CrewDto
            {
                captain = "John Smith",
                chiefEngineer = "Alex Johnson",
                totalCrew = 22,
                crewMembers = new List<CrewMemberDto>
                {
                    new() { id = Guid.NewGuid().ToString(), name = "John Smith", position = "Captain", department = "deck", experience = 18 },
                    new() { id = Guid.NewGuid().ToString(), name = "Alex Johnson", position = "Chief Engineer", department = "engine", experience = 15 },
                    new() { id = Guid.NewGuid().ToString(), name = "Maria Garcia", position = "Second Officer", department = "deck", experience = 9 },
                    new() { id = Guid.NewGuid().ToString(), name = "Chen Wei", position = "Third Engineer", department = "engine", experience = 6 },
                    new() { id = Guid.NewGuid().ToString(), name = "Liam O'Brien", position = "Bosun", department = "deck", experience = 11 },
                    new() { id = Guid.NewGuid().ToString(), name = "Sofia Rossi", position = "Cook", department = "catering", experience = 7 }
                }
            };

            var ops = new OperationsDto
            {
                engineStatus = "running_normal",
                navigation = "auto_pilot",
                communication = "all_systems_ok",
                fuelLevel = 68.5,
                speed = 14.2,
                heading = 275,
                weather = new WeatherDto
                {
                    windSpeed = 18.4,
                    windDirection = 220,
                    waveHeight = 2.1,
                    visibility = 8.5
                }
            };

            return (crew, ops);
        }
    }

    #region dtos to convert estimateAnalysis

    internal class EstimateAnalysisData
    {
        public BestShipDetailedData BestShipDetailed { get; set; }
        public int BestShipId { get; set; }
        public DateTime AnalysisDate { get; set; }
        public string Currency { get; set; }
    }

    internal class BestShipDetailedData
    {
        public List<PortCallData> PortCalls { get; set; }
        public List<BunkerRateData> BunkerRates { get; set; }
        public FinanceMetricsData FinanceMetrics { get; set; }
        public VesselData Vessel { get; set; }
        public List<CargoInputData> Cargoes { get; set; }
    }

    //voyage generation dtos
    internal class VoyageData
    {
        public List<PortCallData> PortCalls { get; set; } = new List<PortCallData>();
        public List<BunkerConsumptionData> BunkerRates { get; set; } = new List<BunkerConsumptionData>();
        public FinanceMetricsData FinanceMetrics { get; set; } = new FinanceMetricsData();
        public VesselData Vessel { get; set; } = new VesselData();
        public CargoInputData CargoInput { get; set; } = new CargoInputData();
    }

    internal class PortCallData
    {
        public int Id { get; set; }
        public int PortId { get; set; }
        public string PortName { get; set; }
        public string Activity { get; set; }
        public decimal PortDays { get; set; }
        public int Speed { get; set; }
        public decimal SecPortDays { get; set; }
        public decimal AdditionalCosts { get; set; }
        public DateTime Eta { get; set; }
        public DateTime Etd { get; set; }
        public int Distance { get; set; }

        public int PortCost { get; set; }
        public int CargoCost { get; set; }

        public decimal SecDistance { get; set; }
        public decimal SecSteamDays { get; set; }
        public List<BunkerConsumptionData> BunkerConsumption { get; set; }
        public bool Europe { get; set; }
        public DistanceResult DistanceResult { get; set; }
    }

    internal class DistanceResult
    {
        public string FromPort { get; set; }
        public string ToPort { get; set; }
        public int Distance { get; set; }
        public List<RoutingPath> RoutingPath { get; set; } = new List<RoutingPath>();
    }


    internal class BunkerConsumptionData
    {
        public int GradeId { get; set; }
        public string Grade { get; set; }
        public decimal PortConsumption { get; set; }
        public decimal SteamConsumption { get; set; }

        //these attributes tobe added in estimate analysis
        public decimal ArrivalQuantity { get; set; }
        public decimal DepartureQuantity { get; set; }
        public decimal BunkeringQuantity { get; set; }
    }

    internal class BunkerRateData
    {
        public string Grade { get; set; }
        public decimal Price { get; set; }
        public decimal PortConsumption { get; set; }
        public decimal BallastPerDayConsumption { get; set; }
        public decimal LadenPerDayConsumption { get; set; }
        public bool IsPrimary { get; set; }
    }

    internal class FinanceMetricsData
    {
        public decimal Revenue { get; set; }
        public decimal VoyageCosts { get; set; }
        public decimal TotalOpEx { get; set; }
        public decimal FinalProfit { get; set; }
        public decimal Tce { get; set; }
        public decimal TotalVoyageDuration { get; set; }
        public decimal TotalBunkerCost { get; set; }
        public decimal TotalAdditionalCosts { get; set; }
        public decimal TotalPortDays { get; set; }
        public decimal TotalSeaDays { get; set; }
        public decimal Duration { get; set; }
        public string Eta { get; set; }
        public decimal Profit { get; set; }
        public decimal FuelCost { get; set; }
        public decimal OperatingCost { get; set; }
        public decimal TotalCost { get; set; }
    }

    internal class VesselData
    {
        public string Currency { get; set; }
        public int Id { get; set; }
        public string VesselName { get; set; }
        public int VoyageType { get; set; }
    }

    internal class CargoInputData
    {
        public string Commodity { get; set; }
        public decimal Quantity { get; set; }
        public string QuantityType { get; set; }
        public List<string> LoadPorts { get; set; } = new List<string>();
        public List<string> DischargePorts { get; set; } = new List<string>();
        public decimal Rate { get; set; }
        public string Currency { get; set; }
        public string RateType { get; set; }
        public string LaycanFrom { get; set; }
        public string LaycanTo { get; set; }
    }

    #endregion
}