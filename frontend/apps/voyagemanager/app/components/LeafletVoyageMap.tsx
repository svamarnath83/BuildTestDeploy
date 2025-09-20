'use client';

import { useEffect, useState, useRef } from 'react';
import { Ship } from 'lucide-react';
import {
  GetVesselPositions,
  Vessel,
  VesselPosition,
  getVesselOverview,
  VesselOverviewDto,
  VoyagePortCallDto
} from '../voyages/libs';

interface LeafletVoyageMapProps {
  onVesselSelect: (vessel: Vessel | null) => void;
  selectedVessel: Vessel | null;
  layoutVersion?: number;
}

// Custom vessel marker icon
const createVesselIcon = (isSelected: boolean, vesselName: string) => {
  const color = '#3B82F6';
  const size = isSelected ? 36 : 28;
  
  return `
    <div class="vessel-marker" style="
      position: relative;
      cursor: pointer;
      transform: translate(-50%, -50%);
      transition: all 0.2s ease;
      filter: drop-shadow(0 0 ${isSelected ? '12px' : '8px'} ${color}40);
    ">
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 2px solid white;
        background: linear-gradient(135deg, ${color}, ${color}dd);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        position: relative;
      ">
        <svg width="${size * 0.4}" height="${size * 0.4}" viewBox="0 0 24 24" fill="white">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
        <div style="
          position: absolute;
          top: -4px;
          right: -4px;
          width: ${size * 0.25}px;
          height: ${size * 0.25}px;
          border-radius: 50%;
          border: 1px solid white;
          background-color: ${color};
        "></div>
      </div>
      <div style="
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 8px;
        background: #1f2937;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        pointer-events: none;
        z-index: 10;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      ">
        ${vesselName}
        <div style="
          position: absolute;
          top: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 8px;
          height: 8px;
          background: #1f2937;
          transform: translateX(-50%) rotate(45deg);
        "></div>
      </div>
    </div>
  `;
};

// Map style configurations
const mapStyles = {
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 19
  }
};

export default function LeafletVoyageMap({ onVesselSelect, selectedVessel, layoutVersion }: LeafletVoyageMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [currentMapStyle, setCurrentMapStyle] = useState<'street' | 'satellite'>('street');
  const [localSelectedVessel, setLocalSelectedVessel] = useState<Vessel | null>(null);
  const [showPopup, setShowPopup] = useState(true);
  const [vesselPositions, setVesselPositions] = useState<VesselPosition[]>([]);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const routeLineRef = useRef<any>(null);
  const popupRef = useRef<any>(null);

  const fetchVesselPositions = async () => {
    const response = await GetVesselPositions();
    setVesselPositions(response.data);
  };

  useEffect(() => {
    setIsClient(true);
    fetchVesselPositions();
  }, []);

  // Sync localSelectedVessel with selectedVessel from parent
  useEffect(() => {
    setLocalSelectedVessel(selectedVessel);
    console.log('Selected vessel changed:', selectedVessel?.id, selectedVessel?.name);
  }, [selectedVessel]);

  const handleVesselSelect = async (vessel: VesselPosition | null) => {
    if (!vessel) return;

    // Fetch vessel overview data from API
    const response = await getVesselOverview(Number(vessel.id));
    const vesselOverview: VesselOverviewDto = response.data;

    // Convert VesselPosition + VesselOverviewDto to Vessel format
    const vesselData: Vessel = {
      id: vessel.id,
      name: vessel.name,
      imo: vesselOverview?.imo,
      position: [Number(vessel.longitude) || 0, Number(vessel.latitude) || 0],
      status: 'at_sea', // Default status
      voyage: vesselOverview.voyage ? {
        id: vesselOverview.voyage.id,
        from: vesselOverview.voyage.from,
        to: vesselOverview.voyage.to,
        cargo: vesselOverview.voyage.cargo,
        route: vesselOverview.voyage.route as [number, number][],
        progress: vesselOverview.voyage.progress
      } : undefined,
      timeline: vesselOverview.portCalls ? vesselOverview.portCalls.map(portCall => {
        // Map port call activity to timeline event type
        const getEventType = (activity: string) => {
          switch (activity?.toLowerCase()) {
            case 'load': return 'port_arrival' as const;
            case 'discharge': return 'port_departure' as const;
            case 'bunker': return 'bunker_event' as const;
            default: return 'port_arrival' as const;
          }
        };

        return {
          id: portCall.sequenceOrder,
          type: getEventType(portCall.activity),
          title: portCall.portName,
          description: portCall.notes || '',
          timestamp: portCall.arrival || portCall.departure || portCall.timeOfBerth || '',
          location: portCall.portName,
          status: portCall.arrival ? 'completed' as const : 'pending' as const,
          color: 'blue' as const
        };
      }) : undefined,
      crew: vesselOverview.crew,
      operations: vesselOverview.operations,
      weather: vesselOverview.weather,
      technical: vesselOverview.technical,
      performance: vesselOverview.performance,
      maintenance: vesselOverview.maintenance
    };

    console.log('Vessel data with voyage:', vesselData);
    console.log('Route data:', vesselData.voyage?.route);

    setLocalSelectedVessel(vesselData);
    onVesselSelect(vesselData); // Update parent component state
    setShowPopup(true); // Show popup when vessel is selected

    // Auto-zoom to vessel position when selected
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([Number(vessel.latitude) || 0, Number(vessel.longitude) || 0], 6, {
        animate: true,
        duration: 1.5
      });
    }
  };

  // Initialize map
  useEffect(() => {
    if (!isClient || !mapRef.current || mapInstanceRef.current) return;

    const initializeMap = async () => {
      try {
        const L = await import('leaflet');

        // Add Leaflet CSS if not already present
        if (!document.querySelector('link[href*="leaflet"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
          link.crossOrigin = '';
          document.head.appendChild(link);
        }

        // Fix default icon URLs
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        // Create map
        const map = L.map(mapRef.current!).setView([50.0, -15.0], 3);
        mapInstanceRef.current = map;

        // Add initial tile layer
        const tileLayer = L.tileLayer(mapStyles[currentMapStyle].url, {
          attribution: mapStyles[currentMapStyle].attribution,
          maxZoom: mapStyles[currentMapStyle].maxZoom,
        }).addTo(map);

        // Add navigation controls
        L.control.zoom({ position: 'topleft' }).addTo(map);

        // Render initial vessels and routes
        renderVessels();
        renderRoute();

      } catch (error) {
        console.error('Error initializing map:', error);
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full bg-gray-100">
              <div class="text-center">
                <div class="text-gray-500 mb-2">Map loading failed</div>
                <div class="text-sm text-gray-400">Please check your internet connection</div>
              </div>
            </div>
          `;
        }
      }
    };

    initializeMap();

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {}
        mapInstanceRef.current = null;
      }
      if (mapRef.current) {
        delete (mapRef.current as any)._leaflet_id;
        mapRef.current.innerHTML = '';
      }
    };
  }, [isClient]);

  // Render vessels
  const renderVessels = async () => {
    if (!mapInstanceRef.current) return;

    const L = await import('leaflet');

    // Clear existing markers
    markersRef.current.forEach(marker => {
      try {
        mapInstanceRef.current.removeLayer(marker);
      } catch {}
    });
    markersRef.current = [];

    // Add vessel markers
    vesselPositions
      .filter(vessel => vessel.latitude && vessel.longitude)
      .forEach((vessel) => {
        const isSelected = selectedVessel?.id === vessel.id;
        const iconHtml = createVesselIcon(isSelected, vessel.name);
        
        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-vessel-icon',
          iconSize: [isSelected ? 36 : 28, isSelected ? 36 : 28],
          iconAnchor: [isSelected ? 18 : 14, isSelected ? 18 : 14]
        });

        const marker = L.marker(
          [Number(vessel.latitude) || 0, Number(vessel.longitude) || 0],
          { icon: customIcon }
        ).addTo(mapInstanceRef.current);

        marker.on('click', () => handleVesselSelect(vessel));
        markersRef.current.push(marker);
      });
  };

  // Render route
  const renderRoute = async () => {
    if (!mapInstanceRef.current || !selectedVessel?.voyage?.route) return;

    const L = await import('leaflet');

    // Clear existing route
    if (routeLineRef.current) {
      try {
        mapInstanceRef.current.removeLayer(routeLineRef.current);
      } catch {}
      routeLineRef.current = null;
    }

    // Add route polyline
    const route = selectedVessel.voyage.route;
    if (route && route.length > 0) {
      const polyline = L.polyline(route, {
        color: '#2563EB',
        weight: 3,
        opacity: 0.9,
        lineJoin: 'round',
        lineCap: 'round'
      }).addTo(mapInstanceRef.current);

      routeLineRef.current = polyline;

      // Fit map to route bounds
      const group = new L.FeatureGroup([polyline]);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  };

  // Update map style
  const updateMapStyle = async (style: 'street' | 'satellite') => {
    if (!mapInstanceRef.current) return;

    const L = await import('leaflet');

    // Remove existing tile layer
    mapInstanceRef.current.eachLayer((layer: any) => {
      if (layer instanceof L.TileLayer) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // Add new tile layer
    L.tileLayer(mapStyles[style].url, {
      attribution: mapStyles[style].attribution,
      maxZoom: mapStyles[style].maxZoom,
    }).addTo(mapInstanceRef.current);

    setCurrentMapStyle(style);
  };

  // Re-render when vessel positions change
  useEffect(() => {
    if (mapInstanceRef.current) {
      renderVessels();
    }
  }, [vesselPositions, selectedVessel]);

  // Re-render route when selected vessel changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      renderRoute();
    }
  }, [selectedVessel]);

  // Handle layout changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    setTimeout(() => {
      try {
        mapInstanceRef.current.invalidateSize();
        if (selectedVessel) {
          mapInstanceRef.current.flyTo(
            [selectedVessel.position[1], selectedVessel.position[0]], 
            6, 
            { animate: true, duration: 0.3 }
          );
        }
      } catch (e) {
        // no-op
      }
    }, 100);
  }, [layoutVersion, selectedVessel]);

  if (!isClient) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="w-full h-full" />

      {/* Map style toggle */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/50">
          <div className="flex">
            <button
              className={`px-3 py-2 text-xs font-medium transition-colors rounded-l-lg ${
                currentMapStyle === 'street'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => updateMapStyle('street')}
            >
              Map
            </button>
            <button
              className={`px-3 py-2 text-xs font-medium transition-colors rounded-r-lg border-l border-gray-200/50 ${
                currentMapStyle === 'satellite'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => updateMapStyle('satellite')}
            >
              Satellite
            </button>
          </div>
        </div>
      </div>

      {/* Vessel Info Popup */}
      {selectedVessel && showPopup && (
        <div className="absolute top-4 left-4 z-10 w-80 bg-white rounded-xl shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-white rounded-t-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Ship className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{selectedVessel.name}</h3>
                </div>
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Vessel ID and Status */}
            <div className="mt-2 flex items-center justify-between">
              <span className="text-blue-100 text-sm">IMO: {selectedVessel.imo?.toUpperCase()}</span>
              <span className="text-blue-100 text-sm">Status: <span className="font-medium capitalize">{selectedVessel.status.replace('_', ' ')}</span></span>
            </div>
          </div>

          {/* Voyage Route */}
          {selectedVessel.voyage && (
            <>
              <div className="px-4 py-3 bg-white">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span className="text-gray-800">Voyage Route</span>
                  <span className="text-blue-400 text-sm">{selectedVessel.voyage.progress}% Complete</span>
                </div>

                {/* Route Visualization with Dots */}
                <div className="flex items-center">
                  <div className="text-center flex-shrink-0">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-1 shadow-md">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-500 font-normal block">{selectedVessel.voyage.from}</span>
                  </div>

                  <div className="flex-1 mx-2">
                    {/* Simple line with start/end points */}
                    <div className="relative w-full flex items-center">
                      {/* Full gray background line */}
                      <div className="w-full h-0.5 bg-gray-300"></div>

                      {/* Blue progress line */}
                      <div
                        className="h-0.5 bg-blue-500 absolute top-0 left-0"
                        style={{ width: `${selectedVessel.voyage.progress}%` }}
                      ></div>

                      {/* Start point circle */}
                      <div className="absolute w-2.5 h-2.5 -top-1 -left-1 rounded-full bg-blue-500 z-10"></div>

                      {/* End point circle */}
                      <div className="absolute w-2.5 h-2.5 -top-1 -right-1 rounded-full bg-gray-400 z-10"></div>

                      {/* Arrow positioned at progress point */}
                      <div
                        className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                        style={{ left: `${selectedVessel.voyage.progress}%` }}
                      >
                        <div className="w-0 h-0 border-l-[10px] border-l-blue-500 border-t-[8px] border-t-transparent border-b-[6px] border-b-transparent"></div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center flex-shrink-0">
                    <div className="w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-1 shadow-md">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-500 font-normal block">{selectedVessel.voyage.to}</span>
                  </div>
                </div>

                {/* Dotted Separator */}
                <div className="flex items-center justify-center py-2">
                  <div className="w-full border-t border-dashed border-gray-300"></div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Position:</span>
                    <div className="font-medium">{selectedVessel.position[1].toFixed(4)}°N</div>
                    <div className="font-medium">{selectedVessel.position[0].toFixed(4)}°E</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Speed/Course:</span>
                    <div className="font-medium">
                      {selectedVessel.operations?.speed || 'N/A'}kn / {selectedVessel.operations?.heading || 'N/A'}°
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Draught:</span>
                    <div className="font-medium">
                      {selectedVessel.technical?.draft || 'N/A'}m
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Cargo:</span>
                    <div className="font-medium">{selectedVessel.voyage?.cargo || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Map info */}
      <div className="absolute bottom-2 left-2 z-10 bg-white/90 backdrop-blur-sm text-gray-700 text-xs px-2 py-1 rounded shadow-sm">
        {currentMapStyle === 'satellite' ? 'Satellite View' : 'Vessel Tracking Map'}
      </div>
    </div>
  );
}
