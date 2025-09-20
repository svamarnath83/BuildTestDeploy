'use client';

import { useState, useEffect } from 'react';
import MapboxVoyageMap from './components/MapboxVoyageMap';
import VesselDetailsPanel from './components/VesselDetailsPanel';
import WeatherVesselPanel from './components/WeatherVesselPanel';
import OperationsDashboard from './components/OperationsDashboard';
import { Vessel } from './voyages/libs';
import { Map, Building2, Fuel, Package, DollarSign, BarChart3, Receipt, Expand, Minimize } from 'lucide-react';
import PortCallList from './voyages/components/PortCallList';
import CargoList from './voyages/components/CargoList';
import BunkerConsumption from './voyages/components/BunkerConsumption';
import FinanceComponent from './voyages/components/FinanceComponent';
import EventAnalysis from './voyages/components/EventAnalysis';
import OtherExpenses from './voyages/components/OtherExpenses';
import type { Voyage } from './voyages/libs';
import { getVoyageById } from './voyages/libs';

type TabType = 'map' | 'portcalls' | 'bunkers' | 'cargoes' | 'finance' | 'events' | 'other';

const TAB_CONFIG = {
  map: { id: 'map' as const, title: 'Map View', icon: Map, color: 'blue-600' },
  finance: { id: 'finance' as const, title: 'Finance', icon: DollarSign, color: 'emerald-600' },
  portcalls: { id: 'portcalls' as const, title: 'Port Calls', icon: Building2, color: 'green-600' },
  bunkers: { id: 'bunkers' as const, title: 'Bunkers', icon: Fuel, color: 'orange-600' },
  cargoes: { id: 'cargoes' as const, title: 'Cargo', icon: Package, color: 'purple-600' },
  events: { id: 'events' as const, title: 'Event Analysis', icon: BarChart3, color: 'indigo-600' },
  other: { id: 'other' as const, title: 'Other Expenses', icon: Receipt, color: 'amber-600' }
} as const;

const DATA_TABS: TabType[] = ['portcalls', 'bunkers', 'cargoes', 'finance', 'events', 'other'];

export default function VoyageManagerHome() {
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('map');
  const [isExpanded, setIsExpanded] = useState(false);
  const [layoutVersion, setLayoutVersion] = useState(0);
  const [selectedVoyage, setSelectedVoyage] = useState<Voyage | null>(null);
  const showDataTabs = !!selectedVessel;
  const panelsHidden = isExpanded || !selectedVessel;

  // If no vessel is selected, force map tab
  useEffect(() => {
    if (!selectedVessel && activeTab !== 'map') {
      setActiveTab('map');
    }
  }, [selectedVessel]);

  // When panel visibility changes, trigger map resize/recenter
  useEffect(() => {
    setLayoutVersion((v) => v + 1);
  }, [panelsHidden]);

  const handleVesselSelect = async (vessel: Vessel | null) => {
    setSelectedVessel(vessel);
    setSelectedVoyage(null); // Clear voyage data when vessel changes
  };

  const handleTabChange = async (tab: TabType) => {
    setActiveTab(tab);
    
    // If switching to a data tab (not map) and we have a selected vessel with voyage
    if (DATA_TABS.includes(tab) && selectedVessel?.voyage?.id) {
      // Only call API if we don't have voyage data yet
      if (!selectedVoyage) {
          const response = await getVoyageById(Number(selectedVessel.voyage.id) || 1);
          setSelectedVoyage(response.data);
          console.log(`Voyage data: ${response.data}`)
      } else {
        console.log(`Using existing voyage data for tab: ${tab}`);
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-100 gap-1">
      {/* Main Content Area */}
      <div className="flex flex-1 gap-1 min-h-0">
        {/* Left Panel - Vessel Details */}
        {!panelsHidden && (
          <div className="w-80 flex-shrink-0 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto min-h-0">
              <VesselDetailsPanel vessel={selectedVessel} />
            </div>
          </div>
        )}

        {/* Central Map */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          {/* Map Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            {Object.entries(TAB_CONFIG).map(([tabKey, config]) => {
              const isDataTab = DATA_TABS.includes(tabKey as TabType);
              const shouldShow = !isDataTab || showDataTabs;
              
              if (!shouldShow) return null;
              
              const IconComponent = config.icon;
              const isActive = activeTab === tabKey;
              
              return (
                <button 
                  key={tabKey}
                  className={`flex items-center justify-center px-3 py-2 text-sm font-medium ${
                    isActive 
                      ? 'text-gray-700 bg-white border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  title={config.title}
                  onClick={() => handleTabChange(tabKey as TabType)}
                >
                  <IconComponent className={`w-4 h-4 text-${config.color}`} />
                </button>
              );
            })}
            <div className="ml-auto flex items-center">
              <span className="text-xs text-gray-600 mr-2">Voyage :</span>
              <select
                className="h-8 text-xs text-gray-700 bg-white border border-gray-300 rounded px-2 mr-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                title="Select option"
                defaultValue=""
              >
                <option value="" disabled>Choose...</option>
                <option value="current">Current Voyage</option>
                <option value="plan">Plan Changes</option>
              </select>
              <button
                className="flex items-center justify-center w-7 h-7 p-0 bg-green-50 text-green-600 hover:bg-green-100 mr-1 border border-green-200 hover:border-green-300 rounded"
                title="Save"
                onClick={() => { /* TODO: wire save action */ }}
              >
                {/* floppy-disk icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <path d="M3 7v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-3-3H6L3 7z"/>
                  <path d="M13 21V13H7v8"/>
                  <path d="M7 3v4h10V3"/>
                </svg>
              </button>
              <button
                className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                title={isExpanded ? 'Restore' : 'Expand'}
                onClick={() => { setIsExpanded(v => !v); setLayoutVersion(v => v + 1); }}
              >
                {isExpanded ? <Minimize className="w-4 h-4" /> : <Expand className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1">
            {activeTab === 'map' && (
              <MapboxVoyageMap 
                  selectedVessel={selectedVessel}
                  onVesselSelect={handleVesselSelect}
                  layoutVersion={layoutVersion}
              />
            )}
            {showDataTabs && activeTab === 'portcalls' && (
              <PortCallList portCalls={selectedVoyage?.portCalls || []} />
            )}
            {showDataTabs && activeTab === 'bunkers' && (
              <BunkerConsumption portCalls={selectedVoyage?.portCalls || []} />
            )}
            {showDataTabs && activeTab === 'cargoes' && (
              <CargoList cargoes={selectedVoyage?.cargoList || []} />
            )}
            {showDataTabs && activeTab === 'finance' && (
              <FinanceComponent financials={selectedVoyage?.financials || []} />
            )}
            {showDataTabs && activeTab === 'events' && (
              <EventAnalysis activities={selectedVoyage?.activities || []} />
            )}
            {showDataTabs && activeTab === 'other' && (
              <OtherExpenses initialExpenses={selectedVoyage?.otherExpenses || []} />
            )}
          </div>
        </div>

        {/* Right Panel - Weather & Vessel Info */}
        {!panelsHidden && (
          <div className="w-80 flex-shrink-0 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto min-h-0">
              <WeatherVesselPanel selectedVessel={selectedVessel} />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Panel - Operations Dashboard */}
      {!panelsHidden && (
        <div className="h-56 flex-shrink-0 bg-white rounded-lg shadow-sm border border-gray-200">
          <OperationsDashboard selectedVessel={selectedVessel} />
        </div>
      )}
    </div>
  );
}