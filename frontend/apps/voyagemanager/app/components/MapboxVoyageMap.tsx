'use client';

import { useEffect, useState, useRef } from 'react';
import Map, { Marker, NavigationControl, Popup, Source, Layer } from 'react-map-gl';
import { Ship, Navigation } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  GetVesselPositions,
  Vessel,
  VesselPosition,
  getVesselOverview,
  VesselOverviewDto,
  VoyagePortCallDto
} from '../voyages/libs';


interface MapboxVoyageMapProps {
  onVesselSelect: (vessel: Vessel | null) => void;
  selectedVessel: Vessel | null;
  layoutVersion?: number;
}

// Custom vessel marker component
const VesselMarker = ({ vessel, isSelected, onClick }: {
  vessel: VesselPosition;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const color = '#3B82F6'; // Default blue color for all vessels
  const size = isSelected ? 36 : 28;

  return (
    <Marker
      longitude={Number(vessel.longitude) || 0}
      latitude={Number(vessel.latitude) || 0}
      onClick={onClick}
    >
      <div
        className="cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110"
        style={{
          filter: `drop-shadow(0 0 ${isSelected ? '12px' : '8px'} ${color}40)`
        }}
      >
        <div
          className="rounded-full border-2 border-white flex items-center justify-center shadow-lg relative"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            background: `linear-gradient(135deg, ${color}, ${color}dd)`,
          }}
        >
          <Ship className="text-white" size={size * 0.4} />
          <div
            className="absolute -top-1 -right-1 rounded-full border border-white"
            style={{
              width: `${size * 0.25}px`,
              height: `${size * 0.25}px`,
              backgroundColor: color,
            }}
          ></div>
        </div>

        {/* Vessel name tooltip - always visible */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-900 text-white px-2 py-1 rounded shadow-lg text-xs font-medium whitespace-nowrap pointer-events-none z-10">
          {vessel.name}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      </div>
    </Marker>
  );
};


export default function MapboxVoyageMap({ onVesselSelect, selectedVessel, layoutVersion }: MapboxVoyageMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/light-v11');
  const [localSelectedVessel, setLocalSelectedVessel] = useState<Vessel | null>(null);
  const [showPopup, setShowPopup] = useState(true);
  const [vesselPositions, setVesselPositions] = useState<VesselPosition[]>([]);
  const mapRef = useRef<any>(null);

  // Mapbox access token - you'll need to get this from mapbox.com
  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
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
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [Number(vessel.longitude) || 0, Number(vessel.latitude) || 0],
        zoom: 6,
        duration: 1500, // 1.5 second smooth animation
        essential: true
      });
    }
  };

  // When layout changes (expand/restore), resize map and recenter
  useEffect(() => {
    if (!mapRef.current) return;
    const center = selectedVessel
      ? [selectedVessel.position[0], selectedVessel.position[1]]
      : [-15.0, 50.0];
    try {
      if (typeof mapRef.current.resize === 'function') {
        mapRef.current.resize();
      } else if (typeof mapRef.current.getMap === 'function') {
        const m = mapRef.current.getMap();
        if (m && typeof m.resize === 'function') m.resize();
      }
      if (typeof mapRef.current.flyTo === 'function') {
        mapRef.current.flyTo({ center, duration: 300, essential: true });
      } else if (typeof mapRef.current.getMap === 'function') {
        const m = mapRef.current.getMap();
        if (m && typeof m.flyTo === 'function') m.flyTo({ center, duration: 300, essential: true });
      }
    } catch (e) {
      // no-op
    }
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
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: -15.0,
          latitude: 50.0,
          zoom: 3
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
        attributionControl={false}
      >
        {/* Navigation controls */}
        <NavigationControl position="top-left" showCompass={false} />

        {/* Simple route for selected vessel */}
        {selectedVessel && selectedVessel.voyage && (
          <>
            {console.log('Rendering route for vessel:', selectedVessel.id, 'Route:', selectedVessel.voyage.route)}
            <Source key={selectedVessel.id} id="route" type="geojson" data={{
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: selectedVessel.voyage.route
                },
                properties: {}
              },
              // Start port marker
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: selectedVessel.voyage.route[0]
                },
                properties: {
                  type: 'start',
                  name: selectedVessel.voyage.from
                }
              },
              // End port marker
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: selectedVessel.voyage.route[selectedVessel.voyage.route.length - 1]
                },
                properties: {
                  type: 'end',
                  name: selectedVessel.voyage.to
                }
              }
            ]
          }}>
            <Layer
              key={`route-line-${selectedVessel.id}`}
              id="route-line"
              type="line"
              paint={{
                'line-color': '#3B82F6',
                'line-width': 4,
                'line-opacity': 0.8
              }}
              layout={{
                'line-join': 'round',
                'line-cap': 'round'
              }}
            />
            <Layer
              key={`start-port-${selectedVessel.id}`}
              id="start-port"
              type="circle"
              filter={['==', ['get', 'type'], 'start']}
              paint={{
                'circle-color': '#10B981',
                'circle-radius': 8,
                'circle-stroke-color': '#ffffff',
                'circle-stroke-width': 3
              }}
            />
            <Layer
              key={`end-port-${selectedVessel.id}`}
              id="end-port"
              type="circle"
              filter={['==', ['get', 'type'], 'end']}
              paint={{
                'circle-color': '#EF4444',
                'circle-radius': 8,
                'circle-stroke-color': '#ffffff',
                'circle-stroke-width': 3
              }}
            />
          </Source>
          </>
        )}


        {/* Vessel markers */}
        {vesselPositions
          .filter(vessel => vessel.latitude && vessel.longitude)
          .map((vessel) => (
            <VesselMarker
              key={vessel.id}
              vessel={vessel}
              isSelected={selectedVessel?.id === vessel.id}
              onClick={() => handleVesselSelect(vessel)}
            />
          ))}

        {/* Vessel Info Popup */}
        {selectedVessel && showPopup && (
          <Popup
            longitude={selectedVessel.position[0]}
            latitude={selectedVessel.position[1]}
            onClose={() => { }} // Don't deselect vessel when popup closes
            closeButton={false}
            closeOnClick={false}
            className="vessel-info-popup"
            anchor="right"
            offset={[10, 0]}
            maxWidth="400px"
          >
            <div className="w-80 bg-transparent shadow-2xl rounded-xl">
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
                      <span className="text-blue-400  text-sm">{selectedVessel.voyage.progress}% Complete</span>
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
                        {/* Simple line with start/end points like in the image */}
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
          </Popup>
        )}
      </Map>

      {/* Map style toggle */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/50">
          <div className="flex">
            <button
              className={`px-3 py-2 text-xs font-medium transition-colors rounded-l-lg ${mapStyle === 'mapbox://styles/mapbox/light-v11'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              onClick={() => setMapStyle('mapbox://styles/mapbox/light-v11')}
            >
              Map
            </button>
            <button
              className={`px-3 py-2 text-xs font-medium transition-colors rounded-r-lg border-l border-gray-200/50 ${mapStyle === 'mapbox://styles/mapbox/satellite-streets-v12'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              onClick={() => setMapStyle('mapbox://styles/mapbox/satellite-streets-v12')}
            >
              Satellite
            </button>
          </div>
        </div>
      </div>

      {/* Map info */}
      <div className="absolute bottom-2 left-2 z-10 bg-white/90 backdrop-blur-sm text-gray-700 text-xs px-2 py-1 rounded shadow-sm">
        {mapStyle.includes('satellite') ? 'Satellite View' : 'Vessel Tracking Map'}
      </div>
    </div>
  );
}