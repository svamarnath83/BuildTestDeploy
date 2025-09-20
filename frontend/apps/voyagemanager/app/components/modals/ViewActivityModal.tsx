'use client';

import { useState, useEffect } from 'react';
import { X, Clock, Ship, MapPin, Package, Fuel, Anchor, AlertTriangle, Navigation } from 'lucide-react';
import { getActivityEvents } from '../../voyages/libs/vessel-service';
import { ActivityEvent } from '../../voyages/libs/operations-models';

interface ViewActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'position_update':
      return <Navigation className="w-4 h-4" />;
    case 'loading':
    case 'unloading':
      return <Package className="w-4 h-4" />;
    case 'departure':
    case 'arrival':
      return <Anchor className="w-4 h-4" />;
    case 'weather_delay':
      return <AlertTriangle className="w-4 h-4" />;
    case 'fuel_update':
      return <Fuel className="w-4 h-4" />;
    case 'maintenance':
      return <Ship className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const colorClasses = {
  blue: 'border-blue-500 bg-blue-50',
  green: 'border-green-500 bg-green-50',
  orange: 'border-orange-500 bg-orange-50',
  purple: 'border-purple-500 bg-purple-50',
  red: 'border-red-500 bg-red-50'
};

const iconColorClasses = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  orange: 'text-orange-600',
  purple: 'text-purple-600',
  red: 'text-red-600'
};

export default function ViewActivityModal({ isOpen, onClose }: ViewActivityModalProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activityData, setActivityData] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivityData = async () => {
      setLoading(true);
      try {
        const data = await getActivityEvents();
        setActivityData(data);
      } catch (error) {
        console.error('Error loading activity data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadActivityData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const eventTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - eventTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''} ago`;
  };

  const activityFilters = [
    { id: 'all', label: 'All Activity', count: activityData.length },
    { id: 'position_update', label: 'Position Updates', count: activityData.filter(a => a.type === 'position_update').length },
    { id: 'loading', label: 'Cargo Operations', count: activityData.filter(a => a.type === 'loading' || a.type === 'unloading').length },
    { id: 'departure', label: 'Port Operations', count: activityData.filter(a => a.type === 'departure' || a.type === 'arrival').length },
    { id: 'weather_delay', label: 'Weather/Delays', count: activityData.filter(a => a.type === 'weather_delay').length },
    { id: 'fuel_update', label: 'Bunker Operations', count: activityData.filter(a => a.type === 'fuel_update').length }
  ];

  const filteredActivity = activityData.filter(activity => {
    const matchesFilter = activeFilter === 'all' || activity.type === activeFilter;
    const matchesSearch = searchTerm === '' || 
      activity.vesselName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-gray-500/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Header */}
          <div className="bg-white px-6 pt-6 pb-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Recent Fleet Activity
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Complete history of vessel operations and events
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search vessels, activities, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                {activityFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      activeFilter === filter.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 bg-white px-6 pb-6 overflow-y-auto">
            <div className="py-4 space-y-3">
              {loading ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Loading Activities</h4>
                  <p className="text-sm">Please wait while we fetch the latest activity data</p>
                </div>
              ) : filteredActivity.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Activity Found</h4>
                  <p className="text-sm">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                filteredActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className={`bg-white p-4 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-shadow ${colorClasses[activity.color as keyof typeof colorClasses]}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`flex-shrink-0 p-2 rounded-full bg-white ${iconColorClasses[activity.color as keyof typeof iconColorClasses]}`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{activity.vesselName}</span>
                            <span className="text-gray-400">•</span>
                            <span className="font-medium text-gray-700">{activity.title}</span>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            {activity.description}
                          </div>
                          <div className="text-xs text-gray-500">
                            {activity.location}
                            {activity.metadata?.speed && ` • Speed: ${activity.metadata.speed} knots`}
                            {activity.metadata?.weatherCondition && ` • Weather: ${activity.metadata.weatherCondition}`}
                            {activity.metadata?.cargoQuantity && ` • Cargo: ${activity.metadata.cargoQuantity.toLocaleString()} MT`}
                            {activity.metadata?.eta && ` • ETA: ${activity.metadata.eta}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="text-xs text-gray-500">
                          {getTimeAgo(activity.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-t">
            <div className="text-xs text-gray-500">
              Showing {filteredActivity.length} of {activityData.length} activities
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  console.log('Export activity log');
                  // TODO: Implement export functionality
                }}
                className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 border border-blue-300 rounded hover:border-blue-400 transition-colors"
              >
                Export Log
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}