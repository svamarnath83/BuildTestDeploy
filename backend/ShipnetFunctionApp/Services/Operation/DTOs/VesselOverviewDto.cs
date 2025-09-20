using System;
using System.Collections.Generic;
using ShipnetFunctionApp.VoyageManager.DTOs;

namespace ShipnetFunctionApp.Services.Operation.DTOs
{
    public class VesselOverviewDto
    {
        public string? latitude { get; set; }
        public string? longitude { get; set; }
        public string? imo { get; set; }
        public VoyageOverviewDto? voyage { get; set; }
        public List<VoyagePortCallDto> portCalls { get; set; } = new();
        public CrewDto? crew { get; set; }
        public OperationsDto? operations { get; set; }
        public WeatherConditionsDto? weather { get; set; }
        public List<WeatherAlertDto> weatherAlerts { get; set; } = new();
        public VesselTechnicalDetailsDto? technical { get; set; }
        public CurrentPerformanceDto? performance { get; set; }
        public MaintenanceScheduleDto? maintenance { get; set; } // new
    }

    /// <summary>
    /// Voyage overview model for vessel tracking and display
    /// </summary>
    public class VoyageOverviewDto
    {
        public long id { get; set; } 
        public string? from { get; set; }
        public string? to { get; set; }
        public string? cargo { get; set; }
        public List<List<double>> route { get; set; } = new();
        public double progress { get; set; }
    }

    // Crew related DTOs (mock data support)
    public class CrewDto
    {
        public string captain { get; set; } = string.Empty;
        public string chiefEngineer { get; set; } = string.Empty;
        public int totalCrew { get; set; }
        public List<CrewMemberDto> crewMembers { get; set; } = new();
    }

    public class CrewMemberDto
    {
        public string id { get; set; } = string.Empty;
        public string name { get; set; } = string.Empty;
        public string position { get; set; } = string.Empty;
        public string department { get; set; } = string.Empty; // deck | engine | catering | other
        public int experience { get; set; } // years
    }

    // Operations related DTOs (mock data support)
    public class OperationsDto
    {
        public string engineStatus { get; set; } = string.Empty; // running_normal | running_abnormal | stopped | maintenance
        public string navigation { get; set; } = string.Empty; // auto_pilot | manual | standby
        public string communication { get; set; } = string.Empty; // all_systems_ok | partial_outage | major_outage
        public double fuelLevel { get; set; } // percentage
        public double speed { get; set; } // knots
        public double heading { get; set; } // degrees
        public WeatherDto weather { get; set; } = new();
    }

    public class WeatherDto
    {
        public double windSpeed { get; set; }
        public double windDirection { get; set; }
        public double waveHeight { get; set; }
        public double visibility { get; set; }
    }

    // New comprehensive weather condition DTO
    public class WeatherConditionsDto
    {
        public string location { get; set; } = string.Empty;
        public string condition { get; set; } = string.Empty;
        public double temperature { get; set; }
        public double windSpeed { get; set; }
        public string windDirection { get; set; } = string.Empty;
        public double waveHeight { get; set; }
        public double visibility { get; set; }
        public double pressure { get; set; }
        public string forecast { get; set; } = string.Empty;
        public double? humidity { get; set; }
        public int? seaState { get; set; }
    }

    public class WeatherAlertDto
    {
        public string id { get; set; } = string.Empty;
        public string type { get; set; } = string.Empty; // warning | advisory | watch
        public string severity { get; set; } = string.Empty; // low | medium | high | critical
        public string title { get; set; } = string.Empty;
        public string description { get; set; } = string.Empty;
        public string validFrom { get; set; } = string.Empty;
        public string validTo { get; set; } = string.Empty;
        public string affectedArea { get; set; } = string.Empty;
    }

    // Technical details DTOs
    public class VesselTechnicalDetailsDto
    {
        public string imo { get; set; } = string.Empty;
        public string mmsi { get; set; } = string.Empty;
        public string callSign { get; set; } = string.Empty;
        public string flag { get; set; } = string.Empty;
        public string builder { get; set; } = string.Empty;
        public int yearBuilt { get; set; }
        public int dwt { get; set; }
        public int grt { get; set; }
        public double length { get; set; }
        public double beam { get; set; }
        public double draft { get; set; }
        public int enginePower { get; set; }
        public double maxSpeed { get; set; }
        public double fuelConsumption { get; set; }
        public string lastMaintenance { get; set; } = string.Empty;
        public string nextMaintenance { get; set; } = string.Empty;
        public string? classification { get; set; }
        public string? insuranceExpiry { get; set; }
    }

    public class VesselSpecificationsDto
    {
        public string hullMaterial { get; set; } = string.Empty;
        public string engineType { get; set; } = string.Empty;
        public string propellerType { get; set; } = string.Empty;
        public List<string> navigationEquipment { get; set; } = new();
        public List<string> communicationEquipment { get; set; } = new();
        public List<string> safetyEquipment { get; set; } = new();
        public double cargoCapacity { get; set; }
        public int? containerCapacity { get; set; }
        public double? tankCapacity { get; set; }
    }

    public class CurrentPerformanceDto
    {
        public double currentSpeed { get; set; }
        public double fuelConsumption { get; set; }
        public string eta { get; set; } = string.Empty;
        public double distanceRemaining { get; set; }
        public double averageSpeed { get; set; }
        public double fuelEfficiency { get; set; }
        public double engineLoad { get; set; }
        public int rpm { get; set; }
        public int powerOutput { get; set; }
        public string fuelType { get; set; } = string.Empty;
        public string lastUpdate { get; set; } = string.Empty;
    }

    public class PerformanceMetricsDto
    {
        public string voyageId { get; set; } = string.Empty;
        public string vesselId { get; set; } = string.Empty;
        public string date { get; set; } = string.Empty;
        public double distanceCovered { get; set; }
        public double fuelUsed { get; set; }
        public double averageSpeed { get; set; }
        public double weatherDelay { get; set; }
        public double portDelay { get; set; }
        public double totalDelay { get; set; }
        public double efficiency { get; set; }
    }

    // Maintenance / Compliance DTOs
    public class MaintenanceRecordDto
    {
        public string id { get; set; } = string.Empty;
        public string type { get; set; } = string.Empty; // scheduled | unscheduled | emergency | inspection
        public string description { get; set; } = string.Empty;
        public string performedDate { get; set; } = string.Empty;
        public string? nextDueDate { get; set; }
        public string status { get; set; } = string.Empty; // completed | pending | overdue | cancelled
        public double? cost { get; set; }
        public string? contractor { get; set; }
        public string? location { get; set; }
        public string? notes { get; set; }
    }

    public class ComplianceStatusDto
    {
        public string certificateName { get; set; } = string.Empty;
        public string certificateNumber { get; set; } = string.Empty;
        public string issuedDate { get; set; } = string.Empty;
        public string expiryDate { get; set; } = string.Empty;
        public string status { get; set; } = string.Empty; // valid | expiring | expired | pending_renewal
        public string issuingAuthority { get; set; } = string.Empty;
        public bool renewalRequired { get; set; }
        public int daysUntilExpiry { get; set; }
    }

    public class MaintenanceScheduleDto
    {
        public string vesselId { get; set; } = string.Empty;
        public string lastDryDock { get; set; } = string.Empty;
        public string nextDryDock { get; set; } = string.Empty;
        public string lastService { get; set; } = string.Empty;
        public string nextService { get; set; } = string.Empty;
        public List<MaintenanceRecordDto> maintenanceRecords { get; set; } = new();
        public List<ComplianceStatusDto> complianceStatus { get; set; } = new();
        public double totalMaintenanceCost { get; set; }
        public double budgetRemaining { get; set; }
    }

    /// <summary>
    /// Voyage timeline event model for tracking vessel activities and milestones
    /// </summary>
    public class VoyageTimelineEvent
    {
        public string id { get; set; } = string.Empty;
        public string type { get; set; } = string.Empty; // 'departure' | 'position_update' | 'weather_alert' | 'port_arrival' | 'port_departure' | 'bunker_event' | 'delay' | 'incident' | 'expected_arrival'
        public string title { get; set; } = string.Empty;
        public string? description { get; set; }
        public string timestamp { get; set; } = string.Empty;
        public string? location { get; set; }
        public string? status { get; set; } // 'completed' | 'in_progress' | 'pending' | 'cancelled'
        public string color { get; set; } = string.Empty; // 'green' | 'blue' | 'yellow' | 'red' | 'gray' | 'orange'
    }
}
