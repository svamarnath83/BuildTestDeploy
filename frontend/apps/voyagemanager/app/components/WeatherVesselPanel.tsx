'use client';

import { CloudRain, Wind, Waves, Eye, Thermometer, MapPin, Anchor, Navigation, Package, Clock, AlertTriangle } from 'lucide-react';
import { Vessel } from '../voyages/libs/vessel-detail-model';
import { format, parseISO, isValid } from 'date-fns';

interface WeatherVesselPanelProps {
  selectedVessel: Vessel | null;
}

// Helper function to safely format dates from API
const formatDate = (dateString: string, formatString: string = 'MMM d, yyyy h:mm a'): string => {
  try {
    // Try parsing as ISO string first
    let date = parseISO(dateString);
    
    // If not valid, try creating a new Date object
    if (!isValid(date)) {
      date = new Date(dateString);
    }
    
    // If still not valid, return the original string
    if (!isValid(date)) {
      return dateString;
    }
    
    return format(date, formatString);
  } catch (error) {
    console.warn('Failed to format date:', dateString, error);
    return dateString;
  }
};

// Helper function to format ETA
const formatETA = (eta: string): string => {
  return formatDate(eta, 'h:mm a');
};

export default function WeatherVesselPanel({ selectedVessel }: WeatherVesselPanelProps) {
  // Use data directly from selectedVessel instead of making API call
  const weather = selectedVessel?.weather;
  const technical = selectedVessel?.technical;
  const performance = selectedVessel?.performance;
  const maintenance = selectedVessel?.maintenance;

  if (!selectedVessel) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          <CloudRain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">Select a Vessel</h3>
          <p className="text-sm">Choose a vessel to view weather and vessel information</p>
        </div>
      </div>
    );
  }

  if (!weather && !technical && !performance && !maintenance) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-orange-300" />
          <h3 className="text-lg font-medium mb-2">Vessel Data Unavailable</h3>
          <p className="text-sm">Vessel information is not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Weather Information */}
      {weather && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <CloudRain className="w-5 h-5 mr-2 text-blue-600" />
            Weather Conditions
          </h3>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">{weather.location}</h4>
            <span className="text-sm text-gray-600">{weather.condition}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-red-500" />
              <div>
                <div className="text-sm font-medium">{weather.temperature}°C</div>
                <div className="text-xs text-gray-600">Temperature</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-blue-500" />
              <div>
                <div className="text-sm font-medium">{weather.windSpeed} kts</div>
                <div className="text-xs text-gray-600">{weather.windDirection}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-teal-500" />
              <div>
                <div className="text-sm font-medium">{weather.waveHeight}m</div>
                <div className="text-xs text-gray-600">Wave Height</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-500" />
              <div>
                <div className="text-sm font-medium">{weather.visibility} nm</div>
                <div className="text-xs text-gray-600">Visibility</div>
              </div>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <AlertTriangle className="w-4 h-4" />
              <span>{weather.forecast}</span>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Voyage Information */}
      {selectedVessel.voyage && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Navigation className="w-5 h-5 mr-2 text-green-600" />
            Current Voyage
          </h3>
          
          <div className="space-y-4">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600">From</label>
                  <div className="text-sm font-medium text-gray-900">{selectedVessel.voyage.from}</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">To</label>
                  <div className="text-sm font-medium text-gray-900">{selectedVessel.voyage.to}</div>
                </div>
              </div>
              
              <div className="mt-3">
                <label className="text-xs font-medium text-gray-600">Cargo</label>
                <div className="flex items-center gap-2 mt-1">
                  <Package className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-gray-900">{selectedVessel.voyage.cargo}</span>
                </div>
              </div>
              
              <div className="mt-3">
                <label className="text-xs font-medium text-gray-600">Progress</label>
                <div className="mt-1">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${selectedVessel.voyage.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{selectedVessel.voyage.progress}% complete</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vessel Technical Information */}
      {technical && (
        <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Anchor className="w-5 h-5 mr-2 text-purple-600" />
          Vessel Details
        </h3>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">IMO</span>
              <div className="font-medium text-gray-900">{technical.imo}</div>
            </div>
            <div>
              <span className="text-gray-600">MMSI</span>
              <div className="font-medium text-gray-900">{technical.mmsi}</div>
            </div>
            <div>
              <span className="text-gray-600">Flag</span>
              <div className="font-medium text-gray-900">{technical.flag}</div>
            </div>
            <div>
              <span className="text-gray-600">Built</span>
              <div className="font-medium text-gray-900">{technical.yearBuilt}</div>
            </div>
            <div>
              <span className="text-gray-600">DWT</span>
              <div className="font-medium text-gray-900">{technical.dwt.toLocaleString()} MT</div>
            </div>
            <div>
              <span className="text-gray-600">Length</span>
              <div className="font-medium text-gray-900">{technical.length}m</div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Performance Metrics */}
      {performance && (
        <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-orange-600" />
          Current Performance
        </h3>
        
        <div className="space-y-3">
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Current Speed</span>
                <div className="font-medium text-gray-900">{performance.currentSpeed} knots</div>
              </div>
              <div>
                <span className="text-gray-600">Fuel Consumption</span>
                <div className="font-medium text-gray-900">{performance.fuelConsumption} MT/day</div>
              </div>
              <div>
                <span className="text-gray-600">ETA</span>
                <div className="font-medium text-gray-900">{formatETA(performance.eta)}</div>
              </div>
              <div>
                <span className="text-gray-600">Distance Remaining</span>
                <div className="font-medium text-gray-900">{performance.distanceRemaining} nm</div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Engine Performance</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Engine Load</span>
                <div className="font-medium text-gray-900">{performance.engineLoad}%</div>
              </div>
              <div>
                <span className="text-gray-600">RPM</span>
                <div className="font-medium text-gray-900">{performance.rpm}</div>
              </div>
              <div>
                <span className="text-gray-600">Power Output</span>
                <div className="font-medium text-gray-900">{performance.powerOutput} kW</div>
              </div>
              <div>
                <span className="text-gray-600">Fuel Type</span>
                <div className="font-medium text-gray-900">{performance.fuelType}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Maintenance & Compliance */}
      {maintenance && (
        <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
          Maintenance & Compliance
        </h3>
        
        <div className="space-y-3">
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Last Dry Dock</span>
                <span className="font-medium text-gray-900">
                  {formatDate(maintenance.lastDryDock, 'MMM yyyy')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Next Service</span>
                <span className="font-medium text-orange-600">
                  {formatDate(maintenance.nextService, 'MMM yyyy')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Classification</span>
                <span className="font-medium text-green-600">{technical?.classification}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Insurance</span>
                <span className="font-medium text-green-600">
                  {technical?.insuranceExpiry ? 
                    formatDate(technical.insuranceExpiry, 'MMM yyyy') : 
                    'Current'
                  }
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Certificates Status</h4>
            <div className="space-y-1 text-xs">
              {maintenance.complianceStatus.map((cert: any, index: number) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-600">{cert.certificateName}</span>
                  <span className={
                    cert.status === 'valid' ? 'text-green-600' : 
                    cert.status === 'expiring' ? 'text-orange-600' : 
                    'text-red-600'
                  }>
                    {cert.status === 'valid' ? '✓' : 
                     cert.status === 'expiring' ? '⚠' : 
                     '✗'} {cert.status === 'valid' ? 'Valid until' : 
                           cert.status === 'expiring' ? 'Expires' : 
                           'Expired'} {formatDate(cert.expiryDate, 'MMM yyyy')}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Maintenance Budget</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Spent</span>
                <span className="font-medium text-gray-900">${maintenance.totalMaintenanceCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Budget Remaining</span>
                <span className="font-medium text-green-600">${maintenance.budgetRemaining.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}