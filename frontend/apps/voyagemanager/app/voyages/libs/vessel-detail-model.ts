import { WeatherConditions } from './weather-models';
import { VesselTechnicalDetails } from './vessel-technical-models';
import { CurrentPerformance } from './performance-models';
import { MaintenanceSchedule } from './maintenance-models';
import { LoginFormValues } from '@commercialapp/ui';

export interface Vessel {
  id: number;
  name: string;
  imo?: string;
  position: [number, number];
  status: 'at_sea' | 'in_port' | 'anchored';
  voyage?: {
    id: number;
    from: string;
    to: string;
    cargo: string;
    route: [number, number][];
    progress: number;
  };
  timeline?: VoyageTimelineEvent[];
  crew?: Crew;
  operations?: Operations;
  
  // Weather information
  weather?: WeatherConditions;
  
  // Technical specifications
  technical?: VesselTechnicalDetails;
  
  // Current performance
  performance?: CurrentPerformance;
  
  // Maintenance and compliance
  maintenance?: MaintenanceSchedule;
  
  // Additional metadata
  lastUpdated?: string; // ISO datetime
  dataSource?: 'api' | 'mock' | 'cached';
  version?: string;
}

export interface VoyageTimelineEvent {
  id: number;
  type: 'departure' | 'position_update' | 'weather_alert' | 'port_arrival' | 'port_departure' | 'bunker_event' | 'delay' | 'incident' | 'expected_arrival';
  title: string;
  description?: string;
  timestamp: string;
  location?: string;
  status?: 'completed' | 'in_progress' | 'pending' | 'cancelled';
  color: 'green' | 'blue' | 'yellow' | 'red' | 'gray' | 'orange';
}

export interface Crew {
  captain: string;
  chiefEngineer: string;
  totalCrew: number;
  crewMembers?: CrewMember[];
}

export interface CrewMember {
  id: string;
  name: string;
  position: string;
  department: 'deck' | 'engine' | 'catering' | 'other';
  experience: number; // years
}

export interface Operations {
  engineStatus: 'running_normal' | 'running_abnormal' | 'stopped' | 'maintenance';
  navigation: 'auto_pilot' | 'manual' | 'standby';
  communication: 'all_systems_ok' | 'partial_outage' | 'major_outage';
  fuelLevel: number; // percentage
  speed: number; // knots
  heading: number; // degrees
  weather: {
    windSpeed: number;
    windDirection: number;
    waveHeight: number;
    visibility: number;
  };
  
}
export interface VesselPosition{
  latitude: string;
  longitude: string;
  id: number;
  name: string;

}
export interface VesselOverviewDto {
  latitude?: string;
  longitude?: string;
  imo?: string;
  voyage?: VoyageOverviewDto;
  portCalls?: VoyagePortCallDto[];
  crew?: Crew;
  operations?: Operations;
  weather?: WeatherConditions;
  technical?: VesselTechnicalDetails;
  performance?: CurrentPerformance;
  maintenance?: MaintenanceSchedule;
}

export interface VoyagePortCallDto {
  id: number;
  voyageId: number;
  sequenceOrder: number;
  portId: number;
  portName: string;
  activity: string;
  speed: number;
  distance: number;
  arrival?: string;
  departure?: string;
  timeOfBerth?: string;
  operatorId?: number;
  operatorName: string;
  portCost: number;
  cargoCost: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VoyageOverviewDto {
  id: number;
  from: string;
  to: string;
  cargo: string;
  route: [number, number][];
  progress: number;
}
