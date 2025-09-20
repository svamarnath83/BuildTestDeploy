import { Vessel, VoyageTimelineEvent, Crew, Operations } from './vessel-detail-model';
import { WeatherConditions, WeatherAlert } from './weather-models';
import { VesselTechnicalDetails, VesselSpecifications } from './vessel-technical-models';
import { CurrentPerformance, PerformanceMetrics } from './performance-models';
import { MaintenanceRecord, ComplianceStatus, MaintenanceSchedule } from './maintenance-models';
import { VesselDetails, VesselDetailsResponse, VesselDetailsRequest } from './vessel-details-models';
import { Alert, ActivityEvent, OperationsSummary } from './operations-models';

// Re-export types for convenience
export type { Vessel, VoyageTimelineEvent, Crew, Operations } from './vessel-detail-model';
export type { WeatherConditions, WeatherAlert } from './weather-models';
export type { VesselTechnicalDetails, VesselSpecifications } from './vessel-technical-models';
export type { CurrentPerformance, PerformanceMetrics } from './performance-models';
export type { MaintenanceRecord, ComplianceStatus, MaintenanceSchedule } from './maintenance-models';
export type { VesselDetails, VesselDetailsResponse, VesselDetailsRequest } from './vessel-details-models';
export type { Alert, ActivityEvent, OperationsSummary } from './operations-models';



// Mock crew data for vessels
const mockCrewData: { [vesselId: string]: Crew } = {
  'v1': {
    captain: 'J. Anderson',
    chiefEngineer: 'M. Chen',
    totalCrew: 22,
    crewMembers: [
      { id: 'crew-1-1', name: 'J. Anderson', position: 'Captain', department: 'deck', experience: 15 },
      { id: 'crew-1-2', name: 'M. Chen', position: 'Chief Engineer', department: 'engine', experience: 12 },
      { id: 'crew-1-3', name: 'S. Williams', position: 'First Officer', department: 'deck', experience: 8 },
      { id: 'crew-1-4', name: 'A. Kumar', position: 'Second Engineer', department: 'engine', experience: 6 }
    ]
  },
  'v2': {
    captain: 'R. Johnson',
    chiefEngineer: 'L. Zhang',
    totalCrew: 18,
    crewMembers: [
      { id: 'crew-2-1', name: 'R. Johnson', position: 'Captain', department: 'deck', experience: 20 },
      { id: 'crew-2-2', name: 'L. Zhang', position: 'Chief Engineer', department: 'engine', experience: 14 },
      { id: 'crew-2-3', name: 'K. Brown', position: 'First Officer', department: 'deck', experience: 10 }
    ]
  },
  'v3': {
    captain: 'P. Martinez',
    chiefEngineer: 'T. Okafor',
    totalCrew: 25,
    crewMembers: [
      { id: 'crew-3-1', name: 'P. Martinez', position: 'Captain', department: 'deck', experience: 18 },
      { id: 'crew-3-2', name: 'T. Okafor', position: 'Chief Engineer', department: 'engine', experience: 16 },
      { id: 'crew-3-3', name: 'E. Schmidt', position: 'First Officer', department: 'deck', experience: 9 }
    ]
  }
};

// Mock operations data for vessels
const mockOperationsData: { [vesselId: string]: Operations } = {
  'v1': {
    engineStatus: 'running_normal',
    navigation: 'auto_pilot',
    communication: 'all_systems_ok',
    fuelLevel: 85,
    speed: 18.5,
    heading: 125,
    weather: {
      windSpeed: 15,
      windDirection: 45,
      waveHeight: 2.5,
      visibility: 8
    }
  },
  'v2': {
    engineStatus: 'running_normal',
    navigation: 'auto_pilot',
    communication: 'all_systems_ok',
    fuelLevel: 72,
    speed: 20.2,
    heading: 285,
    weather: {
      windSpeed: 22,
      windDirection: 90,
      waveHeight: 3.2,
      visibility: 6
    }
  },
  'v3': {
    engineStatus: 'running_normal',
    navigation: 'manual',
    communication: 'all_systems_ok',
    fuelLevel: 68,
    speed: 16.8,
    heading: 270,
    weather: {
      windSpeed: 18,
      windDirection: 120,
      waveHeight: 2.8,
      visibility: 7
    }
  }
};

// Complete Bergen to Singapore route with all waypoints
const bergenToSingaporeRoute: [number, number][] = [
  [5.321277, 60.395294], // Bergen, Norway (start port)
  [5.306026, 60.399471], [5.302486, 60.400684], [5.298954, 60.402687], [5.294899, 60.404609],
  [5.279933, 60.412258], [5.233728, 60.40068], [5.212955, 60.395511], [5.165865, 60.378269],
  [5.166421, 60.374905], [5.166987, 60.371172], // SOTRA BRIDGE (RP)
  [5.169938, 60.344375], [5.163421, 60.334819], [5.152017, 60.328086], [5.145534, 60.320278],
  [5.14096, 60.306659], [5.140045, 60.298717], [5.148727, 60.265613], [5.161088, 60.228256],
  [5.182199, 60.210662], [5.222208, 60.182529], [5.157778, 60.169052], [5.08278, 60.153438],
  [4.975822, 60.137317], [4.934781, 60.132996], [4.905219, 60.027497], [4.860876, 59.909997],
  [4.801752, 59.764397], [3.334087, 51.62395], [3.303835, 51.568775], [3.338258, 51.513477],
  [3.394567, 51.488746], [3.494672, 51.420993], [3.553961, 51.424575], [3.591271, 51.427394],
  [3.61691, 51.424545], [3.636851, 51.415374], [3.658786, 51.415817], [3.674312, 51.410652],
  [3.689268, 51.403614], [3.699213, 51.39952], [3.713023, 51.38322], [3.770107, 51.359619],
  [3.782915, 51.354896], [3.816349, 51.348114], [3.835997, 51.344825], [3.878422, 51.351966],
  [3.901626, 51.359455], [3.950024, 51.391181], [3.980519, 51.435466], [4.000611, 51.435291],
  [4.021404, 51.429054], [4.030943, 51.423091], [4.037209, 51.388805], [4.050592, 51.375621],
  [4.075786, 51.370903], [4.116356, 51.369029], [4.148813, 51.375354], [4.185236, 51.398063],
  [4.194201, 51.399131], [4.20843, 51.395835], [4.221805, 51.36779], [4.223797, 51.363246],
  [4.249267, 51.352378], [4.270817, 51.342311], [4.273838, 51.33522], [4.273838, 51.304233],
  [4.287053, 51.297908], [4.314193, 51.291137], [4.321724, 51.286506], [4.323002, 51.282611],
  [4.320447, 51.279495], [4.297881, 51.265338], [4.299442, 51.259552], [4.3081, 51.253494],
  [4.326286, 51.251811], [4.350786, 51.23986], [4.378766, 51.238887], [4.395793, 51.237197],
  [4.39872, 51.234538], [4.39977, 51.235009], // ANTWERP
  [4.39872, 51.234538], [4.395793, 51.237197], [4.378766, 51.238887], [4.350786, 51.23986],
  [4.326286, 51.251811], [4.3081, 51.253494], [4.299442, 51.259552], [4.297881, 51.265338],
  [4.320447, 51.279495], [4.323002, 51.282611], [4.321724, 51.286506], [4.314193, 51.291137],
  [4.287053, 51.297908], [4.273838, 51.304233], [4.273838, 51.33522], [4.270817, 51.342311],
  [4.249267, 51.352378], [4.223797, 51.363246], [4.221805, 51.36779], [4.20843, 51.395835],
  [4.194201, 51.399131], [4.185236, 51.398063], [4.148813, 51.375354], [4.116356, 51.369029],
  [4.075786, 51.370903], [4.050592, 51.375621], [4.037209, 51.388805], [4.030943, 51.423091],
  [4.021404, 51.429054], [4.000611, 51.435291], [3.980519, 51.435466], [3.950024, 51.391181],
  [3.901626, 51.359455], [3.878422, 51.351966], [3.835997, 51.344825], [3.816349, 51.348114],
  [3.782915, 51.354896], [3.770107, 51.359619], [3.713023, 51.38322], [3.699213, 51.39952],
  [3.689268, 51.403614], [3.674312, 51.410652], [3.658786, 51.415817], [3.636851, 51.415374],
  [3.61691, 51.424545], [3.591271, 51.427394], [3.553961, 51.424575], [3.494672, 51.420993],
  [3.437229, 51.41555], [3.346557, 51.414669], [2.509286, 51.372675], [2.405083, 51.352821],
  [1.755269, 51.216682], // DOVER TSS SOUTH WEST (RP)
  [1.479825, 51.060405], // DOVER STRAIT (RP)
  [0.650216, 50.609943], [-2.919967, 49.976425], [-4.999999, 49.209391], [-5.785245, 48.90485],
  [-5.985346, 48.68827], [-9.822393, 43.473854], [-9.963385, 43.147487], [-10.007181, 38.920783],
  [-10.035977, 38.725849], [-9.948535, 38.520881], [-9.509445, 36.830627], [-9.332768, 36.677471],
  [-8.931507, 36.567207], [-6.308628, 35.752689], [-5.979945, 35.808667], [-5.927623, 35.836001],
  [-5.909244, 35.845603], [-5.810555, 35.882778], [-5.577642, 35.952735], [-5.453954, 35.979437], // GIBRALTAR STRAIT (RP)
  [-5.31884, 36.014478], [-0.523561, 36.802234], [6.459104, 37.160686], [9.756711, 37.423244],
  [10.81207, 37.224037], [11.095683, 37.150562], [31.918359, 31.618486], [32.266666, 31.400745],
  [32.377231, 31.331626], [32.345447, 31.234481], [32.334651, 31.194654], [32.313877, 31.115726],
  [32.310596, 31.082529], [32.31771, 30.917385], [32.319698, 30.86857], [32.31771, 30.847145],
  [32.318363, 30.806192], [32.345989, 30.710428], [32.323871, 30.613002], [32.309547, 30.588949],
  [32.305572, 30.58315], [32.303886, 30.567665], [32.306201, 30.553089], [32.31821, 30.540229],
  [32.335151, 30.518259], [32.339519, 30.503551], [32.348579, 30.458572], [32.361526, 30.412458],
  [32.372459, 30.357374], [32.439098, 30.279357], [32.489112, 30.266361], [32.523204, 30.256128],
  [32.536903, 30.246723], [32.546146, 30.232891], [32.565898, 30.201347], [32.568439, 30.188606],
  [32.572727, 30.083616], [32.572139, 30.06011], [32.575149, 30.043897], [32.584309, 29.992235], // SUEZ CANAL (RP)
  [32.585041, 29.989556], [32.586708, 29.977949], [32.585521, 29.960371], [32.582508, 29.951354],
  [32.576637, 29.943405], [32.552898, 29.923503], [32.546371, 29.907087], [32.552455, 29.85149],
  [32.545051, 29.804944], [32.547327, 29.75427], [32.555995, 29.601079], [32.587421, 29.552368],
  [32.609474, 29.489147], [32.647121, 29.412368], [32.762889, 29.193895], [33.134731, 28.502651],
  [33.672649, 27.893159], [33.826698, 27.750873], [33.965488, 27.621835], [34.034294, 27.560306],
  [34.112201, 27.480337], [40.662342, 17.142036], [40.879482, 16.703586], [42.595558, 13.632533],
  [42.741371, 13.462251], [43.25, 12.683333], [43.343704, 12.58785], [43.465522, 12.530677], // GULF OF ADEN (RP)
  [43.792758, 12.365766], [44.242046, 12.187705], [45, 11.899999], // IRTC POINT A (RP)
  [53, 14.399999], [54.552786, 14.470767], [77.149177, 7.080412], [80.003692, 5.807416],
  [80.446478, 5.681421], [80.708125, 5.646138], [83.973419, 5.929736], [91.997978, 6.11921],
  [95.282025, 6.147939], // NORTH OF SABANG (RP)
  [97.548492, 5.397725], [103.439745, 1.23524], [103.481312, 1.210112], // SINGAPORE STRAIT (RP)
  [103.657359, 1.177865], [103.731654, 1.146281], [103.811689, 1.18616], [103.830745, 1.19438],
  [103.861837, 1.205228], [103.868835, 1.220771], [103.853836, 1.256884], [103.845123, 1.258516],
  [103.837623, 1.264841], [103.833347, 1.265856], [103.833335, 1.266666] // SINGAPORE (destination port)
];

// Mock weather data for vessels
const mockWeatherData: { [vesselId: string]: WeatherConditions } = {
  'v1': {
    location: 'North Sea',
    condition: 'Partly Cloudy',
    temperature: 12,
    windSpeed: 18,
    windDirection: 'NW',
    waveHeight: 2.3,
    visibility: 8,
    pressure: 1013,
    forecast: 'Improving conditions expected',
    humidity: 75,
    seaState: 4
  },
  'v2': {
    location: 'Hamburg Port',
    condition: 'Overcast',
    temperature: 15,
    windSpeed: 12,
    windDirection: 'SW',
    waveHeight: 1.1,
    visibility: 6,
    pressure: 1008,
    forecast: 'Light rain expected later',
    humidity: 85,
    seaState: 2
  },
  'v3': {
    location: 'Norwegian Sea',
    condition: 'Clear',
    temperature: 8,
    windSpeed: 22,
    windDirection: 'N',
    waveHeight: 3.1,
    visibility: 12,
    pressure: 1021,
    forecast: 'Stable conditions continuing',
    humidity: 65,
    seaState: 5
  }
};

// Mock vessel technical data
const mockVesselTechnicalData: { [vesselId: string]: VesselTechnicalDetails } = {
  'v1': {
    imo: '9123456',
    mmsi: '255801234',
    callSign: 'TCQX',
    flag: 'Marshall Islands',
    builder: 'Hyundai Heavy Industries',
    yearBuilt: 2018,
    dwt: 75000,
    grt: 45000,
    length: 225,
    beam: 32.2,
    draft: 12.5,
    enginePower: 15400,
    maxSpeed: 22.5,
    fuelConsumption: 45.2,
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-04-15',
    classification: 'DNV GL',
    insuranceExpiry: '2025-06-30'
  },
  'v2': {
    imo: '9123457',
    mmsi: '255801235',
    callSign: 'TCQY',
    flag: 'Panama',
    builder: 'Daewoo Shipbuilding',
    yearBuilt: 2019,
    dwt: 85000,
    grt: 52000,
    length: 245,
    beam: 35.0,
    draft: 13.2,
    enginePower: 16800,
    maxSpeed: 24.0,
    fuelConsumption: 48.5,
    lastMaintenance: '2024-02-10',
    nextMaintenance: '2024-05-10',
    classification: 'Lloyd\'s Register',
    insuranceExpiry: '2025-08-15'
  },
  'v3': {
    imo: '9123458',
    mmsi: '255801236',
    callSign: 'TCQZ',
    flag: 'Liberia',
    builder: 'Samsung Heavy Industries',
    yearBuilt: 2020,
    dwt: 95000,
    grt: 58000,
    length: 265,
    beam: 38.0,
    draft: 14.0,
    enginePower: 18200,
    maxSpeed: 25.5,
    fuelConsumption: 52.1,
    lastMaintenance: '2024-03-05',
    nextMaintenance: '2024-06-05',
    classification: 'ABS',
    insuranceExpiry: '2025-09-20'
  }
};

// Mock current performance data
const mockCurrentPerformance: { [vesselId: string]: CurrentPerformance } = {
  'v1': {
    currentSpeed: 18.5,
    fuelConsumption: 42.3,
    eta: '2025-01-20T14:30:00Z',
    distanceRemaining: 245,
    averageSpeed: 17.8,
    fuelEfficiency: 2.3,
    engineLoad: 78,
    rpm: 95,
    powerOutput: 12000,
    fuelType: 'MGO',
    lastUpdate: '2025-01-18T12:00:00Z'
  },
  'v2': {
    currentSpeed: 20.2,
    fuelConsumption: 45.8,
    eta: '2025-01-25T16:00:00Z',
    distanceRemaining: 320,
    averageSpeed: 19.5,
    fuelEfficiency: 2.3,
    engineLoad: 82,
    rpm: 98,
    powerOutput: 13800,
    fuelType: 'MGO',
    lastUpdate: '2025-01-18T12:00:00Z'
  },
  'v3': {
    currentSpeed: 16.8,
    fuelConsumption: 38.9,
    eta: '2025-01-28T08:00:00Z',
    distanceRemaining: 180,
    averageSpeed: 16.2,
    fuelEfficiency: 2.3,
    engineLoad: 75,
    rpm: 92,
    powerOutput: 13650,
    fuelType: 'MGO',
    lastUpdate: '2025-01-18T12:00:00Z'
  }
};




// Service functions for new data
export const getWeatherForVessel = (vesselId: string): WeatherConditions | undefined => {
  return mockWeatherData[vesselId];
};

export const getVesselTechnicalDetails = (vesselId: string): VesselTechnicalDetails | undefined => {
  return mockVesselTechnicalData[vesselId];
};

export const getCurrentPerformance = (vesselId: string): CurrentPerformance | undefined => {
  return mockCurrentPerformance[vesselId];
};


// Mock alerts data
const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    vesselId: 'v1',
    vesselName: 'MV Ocean Pioneer',
    type: 'weather',
    message: 'Approaching heavy weather area - North Sea',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    location: 'North Sea',
    severity: 'high',
    acknowledged: false
  },
  {
    id: 'alert-2',
    vesselId: 'v3',
    vesselName: 'MV Atlantic Crossing',
    type: 'info',
    message: 'ETA updated - arriving 2 hours early',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    location: 'Mediterranean Sea',
    severity: 'low',
    acknowledged: true,
    acknowledgedBy: 'Operations Team',
    acknowledgedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: 'alert-3',
    vesselId: 'v2',
    vesselName: 'MV Baltic Express',
    type: 'port',
    message: 'Port berth delay - extended wait time',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    location: 'Hamburg Port',
    severity: 'critical',
    acknowledged: false
  }
];

// Mock activity events data
const mockActivityEvents: ActivityEvent[] = [
  {
    id: 'activity-1',
    vesselId: 'v1',
    vesselName: 'MV Ocean Pioneer',
    type: 'position_update',
    title: 'Position Update',
    description: 'Crossing North Sea - On schedule',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    location: 'North Sea',
    status: 'completed',
    color: 'blue',
    metadata: {
      speed: 18.5,
      course: 125,
      weatherCondition: 'Partly Cloudy'
    }
  },
  {
    id: 'activity-2',
    vesselId: 'v2',
    vesselName: 'MV Baltic Express',
    type: 'loading',
    title: 'Loading Completed',
    description: 'Cargo loading completed successfully',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    location: 'Port of Hamburg',
    status: 'completed',
    color: 'green',
    metadata: {
      cargoQuantity: 15000,
      portName: 'Hamburg'
    }
  },
  {
    id: 'activity-3',
    vesselId: 'v3',
    vesselName: 'MV Atlantic Crossing',
    type: 'departure',
    title: 'Departed Oslo',
    description: 'Vessel departed from Oslo port',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    location: 'Oslo, Norway',
    status: 'completed',
    color: 'blue',
    metadata: {
      eta: '18:30',
      portName: 'Copenhagen'
    }
  },
  {
    id: 'activity-4',
    vesselId: 'v3',
    vesselName: 'MV Atlantic Crossing',
    type: 'weather_delay',
    title: 'Weather Delay Reported',
    description: 'Rough seas encountered, reduced speed',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    location: 'Mid-Atlantic',
    status: 'in_progress',
    color: 'orange',
    metadata: {
      weatherCondition: 'Rough seas',
      speed: 12.5
    }
  }
];

// Mock operations summary
const mockOperationsSummary: OperationsSummary = {
  totalVessels: 3,
  activeVoyages: 3,
  alertsCount: 3,
  criticalAlerts: 1,
  recentActivities: 4,
  averageSpeed: 16.8,
  totalCargo: 45000,
  fuelConsumption: 126.4
};

// Service functions for operations data
export const getAlerts = (): Alert[] => {
  return mockAlerts;
};

export const getActivityEvents = (): ActivityEvent[] => {
  return mockActivityEvents;
};

export const getOperationsSummary = (): OperationsSummary => {
  return mockOperationsSummary;
};

export const getAlertsByVessel = (vesselId: string): Alert[] => {
  return mockAlerts.filter(alert => alert.vesselId === vesselId);
};

export const getActivityEventsByVessel = (vesselId: string): ActivityEvent[] => {
  return mockActivityEvents.filter(activity => activity.vesselId === vesselId);
};
