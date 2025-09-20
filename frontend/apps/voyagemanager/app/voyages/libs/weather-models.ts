export interface WeatherConditions {
  location: string;
  condition: string;
  temperature: number; // Celsius
  windSpeed: number; // knots
  windDirection: string; // Compass direction (e.g., 'NW', 'SW', 'N')
  waveHeight: number; // meters
  visibility: number; // nautical miles
  pressure: number; // hPa
  forecast: string;
  humidity?: number; // percentage
  seaState?: number; // 0-9 scale
}

export interface WeatherAlert {
  id: string;
  type: 'warning' | 'advisory' | 'watch';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  validFrom: string;
  validTo: string;
  affectedArea: string;
}
