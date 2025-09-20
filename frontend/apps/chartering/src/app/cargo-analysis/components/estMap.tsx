import React, { useEffect, useRef } from 'react';

interface EstMapProps {
  schedule?: any[];
  vessel?: any;
}

const EstMap: React.FC<EstMapProps> = ({ schedule, vessel }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const routeLineRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current && !mapRef.current.hasChildNodes()) {
      initializeMap();
    }

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
  }, []);

  useEffect(() => {
    renderRouteFromSchedule();
  }, [schedule]);

  const initializeMap = async () => {
    try {
      const L = await import('leaflet');

      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);
      }

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      if ((mapRef.current as any)._leaflet_id) {
        return;
      }

      const map = L.map(mapRef.current!).setView([30, 30], 3);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      renderRouteFromSchedule();
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

  const renderRouteFromSchedule = async () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const L = await import('leaflet');

    // clear previous polylines
    if (routeLineRef.current.length) {
      routeLineRef.current.forEach(line => { try { map.removeLayer(line); } catch {} });
      routeLineRef.current = [];
    }
    // clear labels
    if (markersRef.current.length) {
      markersRef.current.forEach(m => { try { map.removeLayer(m); } catch {} });
      markersRef.current = [];
    }

    const markers: any[] = [];

    // de-dup labels across legs
    const labeled = new Set<string>();

    if (schedule && schedule.length) {
      for (let i = 0; i < schedule.length; i++) {
        const call = schedule[i];
        const path = call?.DistanceResult?.RoutingPath as Array<{ Name?: string; Latitude: number; Longitude: number }> | undefined;
        if (Array.isArray(path) && path.length > 0) {
          const pathCoords: [number, number][] = [];
          const legNamed: Array<{ lat: number; lng: number; name: string }> = [];
          path.forEach(pt => {
            if (typeof pt.Latitude === 'number' && typeof pt.Longitude === 'number') {
              const lat = pt.Latitude;
              const lng = pt.Longitude;
              pathCoords.push([lat, lng]);
              const name = typeof pt.Name === 'string' ? pt.Name.trim() : '';
              if (name) legNamed.push({ lat, lng, name });
            }
          });
          if (pathCoords.length > 1) {
            const poly = L.polyline(pathCoords.map(([lat, lng]) => [lat, lng] as [number, number]), {
              color: '#2563EB',
              weight: 3,
              opacity: 0.9,
            }).addTo(map);
            routeLineRef.current.push(poly);
          }

          // label endpoints of this leg only
          if (legNamed.length > 0) {
            const start = legNamed[0];
            const end = legNamed[legNamed.length - 1];
            const makeLabel = (text: string, color: string) => L.divIcon({
              className: 'routing-label',
              html: `<div style="display:inline-flex; align-items:center; gap:4px; background: transparent; padding: 0; border: none;"><span style="width:8px;height:8px;border-radius:9999px;background:${color};display:inline-block;"></span><span style="color:#111827; font-size:11px; line-height:1; white-space: nowrap;">${text}</span></div>`,
              iconSize: [0, 0],
              iconAnchor: [-6, -6]
            });
            const add = (p: { lat: number; lng: number; name: string }, color: string) => {
              const key = `${p.name}|${p.lat.toFixed(5)}|${p.lng.toFixed(5)}`;
              if (!labeled.has(key)) {
                const marker = L.marker([p.lat, p.lng], { icon: makeLabel(p.name, color), interactive: false }).addTo(map);
                markers.push(marker);
                labeled.add(key);
              }
            };
            if (start?.name) add(start, '#10B981');
            if (end && end !== start && end?.name) add(end, '#EF4444');
          }
        }
      }
    }

    // fit bounds to all layers
    const layersForBounds: any[] = [...routeLineRef.current, ...markers];
    if (layersForBounds.length) {
      try {
        const group = new L.FeatureGroup(layersForBounds);
        map.fitBounds(group.getBounds().pad(0.1));
      } catch {}
    }

    markersRef.current = markers;

    const loadingOverlay = document.getElementById('map-loading');
    if (loadingOverlay) loadingOverlay.style.display = 'none';
  };

  return (
    <div className="w-full h-96 bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="relative h-full">
        <div ref={mapRef} className="w-full h-full" />

        <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
          <div className="text-xs font-medium text-gray-700 mb-2">Legend</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-blue-600 opacity-80" style={{ borderTop: '2px solid #2563EB' }}></div>
              <span className="text-xs text-gray-600">Routing Path</span>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-[999]" id="map-loading">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
            <div className="text-sm text-gray-600">Loading OpenStreetMap...</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstMap; 