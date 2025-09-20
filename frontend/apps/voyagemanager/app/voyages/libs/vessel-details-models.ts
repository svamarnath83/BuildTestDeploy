import { Vessel } from './vessel-detail-model';
import { WeatherConditions, WeatherAlert } from './weather-models';
import { VesselTechnicalDetails, VesselSpecifications } from './vessel-technical-models';
import { CurrentPerformance, PerformanceMetrics } from './performance-models';
import { MaintenanceRecord, ComplianceStatus, MaintenanceSchedule } from './maintenance-models';

// Unified vessel details model that contains all vessel information
export interface VesselDetails extends Vessel {
  // Weather information
  weather: WeatherConditions;
  weatherAlerts?: WeatherAlert[];
  
  // Technical specifications
  technical: VesselTechnicalDetails;
  specifications?: VesselSpecifications;
  
  // Current performance
  performance: CurrentPerformance;
  performanceHistory?: PerformanceMetrics[];
  
  // Maintenance and compliance
  maintenance: MaintenanceSchedule;
  
  // Additional metadata
  lastUpdated: string; // ISO datetime
  dataSource: 'api' | 'mock' | 'cached';
  version: string;
}

// API response wrapper
export interface VesselDetailsResponse {
  success: boolean;
  data: VesselDetails;
  message?: string;
  timestamp: string;
}

// API request parameters
export interface VesselDetailsRequest {
  vesselId: string;
  includeHistory?: boolean;
  includeAlerts?: boolean;
  includeSpecifications?: boolean;
}
