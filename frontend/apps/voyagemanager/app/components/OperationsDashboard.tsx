'use client';

import { Ship, AlertTriangle, Clock, TrendingUp, Filter, Bell, Plus, Edit } from 'lucide-react';
import { useState, useEffect } from 'react';
import AddEventModal from './modals/AddEventModal';
import ViewReportsModal from './modals/ViewReportsModal';
import ViewActivityModal from './modals/ViewActivityModal';
import { Vessel } from '../voyages/libs/vessel-detail-model';
import { getActivityEvents, getAlerts, getOperationsSummary } from '../voyages/libs/vessel-service';
import { ActivityEvent, Alert, OperationsSummary } from '../voyages/libs/operations-models';

interface OperationsDashboardProps {
  selectedVessel: Vessel | null;
}

export default function OperationsDashboard({ selectedVessel }: OperationsDashboardProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'container' | 'bulk' | 'tanker'>('all');
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showViewReportsModal, setShowViewReportsModal] = useState(false);
  const [showViewActivityModal, setShowViewActivityModal] = useState(false);
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [operationsSummary, setOperationsSummary] = useState<OperationsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [events, alertsData, summary] = await Promise.all([
          getActivityEvents(),
          getAlerts(),
          getOperationsSummary()
        ]);
        setActivityEvents(events);
        setAlerts(alertsData);
        setOperationsSummary(summary);
      } catch (error) {
        console.error('Error loading operations data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const alertTypeColors = {
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    critical: 'bg-red-100 text-red-800 border-red-200',
    weather: 'bg-orange-100 text-orange-800 border-orange-200',
    port: 'bg-purple-100 text-purple-800 border-purple-200',
    maintenance: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const alertIcons = {
    warning: '⚠️',
    info: 'ℹ️',
    critical: '🚨',
    weather: '🌊',
    port: '🏗️',
    maintenance: '🔧'
  };

  const getTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const eventTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - eventTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''} ago`;
  };

  const handleOpenModal = (modalType: string) => {
    switch (modalType) {
      case 'addEvent':
        setShowAddEventModal(true);
        break;
      case 'viewReports':
        setShowViewReportsModal(true);
        break;
      case 'activity':
        setShowViewActivityModal(true);
        break;
      default:
        console.log(`Opening ${modalType} modal`);
        // Other modal types to be implemented
    }
  };

  return (
    <div className="h-full flex flex-col p-3">
      {/* Main Row - Recent Activity and Quick Actions */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-3">
        {/* Recent Activity - Full Length Left */}
        <div className="lg:col-span-3 bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-medium text-gray-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gray-600" />
              Recent Activity
            </h3>
            <button 
              onClick={() => handleOpenModal('activity')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All
            </button>
          </div>
          <div className="space-y-2">
            {loading ? (
              <div className="text-center text-gray-500 py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <div className="text-sm">Loading activities...</div>
              </div>
            ) : activityEvents.length > 0 ? (
              activityEvents.slice(0, 4).map((event) => {
                const borderColor = {
                  blue: 'border-blue-500',
                  green: 'border-green-500',
                  orange: 'border-orange-500',
                  red: 'border-red-500',
                  purple: 'border-purple-500',
                  yellow: 'border-yellow-500'
                }[event.color] || 'border-gray-500';

                const textColor = {
                  blue: 'text-blue-600',
                  green: 'text-green-600',
                  orange: 'text-orange-600',
                  red: 'text-red-600',
                  purple: 'text-purple-600',
                  yellow: 'text-yellow-600'
                }[event.color] || 'text-gray-600';

                return (
                  <div key={event.id} className={`text-sm text-gray-700 bg-white p-3 rounded border-l-4 ${borderColor}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">{event.vesselName}</span> {event.title.toLowerCase()}
                        <div className="text-xs text-gray-500 mt-1">
                          {event.location}
                          {event.metadata?.cargoQuantity && ` • ${event.metadata.cargoQuantity.toLocaleString()} MT cargo loaded`}
                          {event.metadata?.eta && ` • ETA: ${event.metadata.eta}`}
                          {event.metadata?.weatherCondition && ` • ${event.metadata.weatherCondition}`}
                        </div>
                      </div>
                      <span className={`${textColor} text-xs`}>{getTimeAgo(event.timestamp)}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-500 py-4">
                <div className="text-sm">No recent activities</div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions - Right Side */}
        <div className="bg-gray-50 rounded-lg p-4">
          {!selectedVessel ? (
            <div className="text-center text-gray-500 py-4">
              <div className="text-sm mb-2">Select a vessel to access actions</div>
              <div className="text-xs">Click on a vessel marker on the map</div>
            </div>
          ) : (
            <div>
              <div className="bg-blue-50 rounded-lg p-2 mb-3">
                <div className="text-xs text-gray-600">Selected Vessel</div>
                <div className="font-medium text-gray-900 text-sm">{selectedVessel.name}</div>
                <div className="text-xs text-gray-500">
                  {selectedVessel.voyage ? `${selectedVessel.voyage.from} → ${selectedVessel.voyage.to}` : 'No active voyage'}
                </div>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => handleOpenModal('addEvent')}
                  className="w-full text-left text-sm bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Add Event
                </button>
                <button 
                  onClick={() => handleOpenModal('viewReports')}
                  className="w-full text-left text-sm bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300 transition-colors"
                >
                  View Reports
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddEventModal
        isOpen={showAddEventModal}
        onClose={() => setShowAddEventModal(false)}
        selectedVessel={selectedVessel}
      />
      
      <ViewReportsModal
        isOpen={showViewReportsModal}
        onClose={() => setShowViewReportsModal(false)}
        selectedVessel={selectedVessel}
      />
      
      <ViewActivityModal
        isOpen={showViewActivityModal}
        onClose={() => setShowViewActivityModal(false)}
      />
    </div>
  );
}