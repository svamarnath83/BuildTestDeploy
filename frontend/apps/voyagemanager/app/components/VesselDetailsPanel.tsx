'use client';

import { Ship, Navigation, Clock, Package, MapPin, Fuel } from 'lucide-react';
import { Vessel, VoyageTimelineEvent, Crew, Operations } from '../voyages/libs/vessel-detail-model';
import { format, parseISO, isValid } from 'date-fns';

interface VesselDetailsPanelProps {
  vessel: Vessel | null;
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

export default function VesselDetailsPanel({ vessel }: VesselDetailsPanelProps) {
  if (!vessel) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          <Ship className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">Select a Vessel</h3>
          <p className="text-sm">Click on a vessel on the map to view details</p>
        </div>
      </div>
    );
  }

  const statusColors = {
    at_sea: 'bg-blue-100 text-blue-800',
    in_port: 'bg-green-100 text-green-800',
    anchored: 'bg-orange-100 text-orange-800'
  };

  const statusLabels = {
    at_sea: 'At Sea',
    in_port: 'In Port',
    anchored: 'Anchored'
  };

  return (
    <div className="p-6 space-y-6">
      {/* Vessel Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-gray-900">{vessel.name}</h2>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[vessel.status]}`}>
            {statusLabels[vessel.status]}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{vessel.position[0].toFixed(4)}, {vessel.position[1].toFixed(4)}</span>
        </div>
      </div>

      {/* Voyage Timeline & Events */}
      {vessel.voyage ? (
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Voyage Timeline</h3>
          
          {vessel.timeline && vessel.timeline.length > 0 ? (
            <div className="space-y-3">
              {vessel.timeline.map((event) => (
                <div key={event.id} className="flex items-start gap-3">
                  <div className={`w-2 h-2 bg-${event.color}-500 rounded-full mt-2`}></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{event.title}</div>
                    <div className="text-xs text-gray-500">
                      {formatDate(event.timestamp, 'MMM d, yyyy h:mm a')}
                    </div>
                    {event.description && (
                      <div className="text-xs text-gray-600">{event.description}</div>
                    )}
                    {event.location && (
                      <div className="text-xs text-gray-500">{event.location}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">No timeline events available.</p>
          )}
        </div>
      ) : (
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">No Active Voyage</h3>
          <p className="text-gray-600 text-sm">This vessel is not currently assigned to a voyage.</p>
        </div>
      )}

      {/* Crew & Operations */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Crew & Operations</h3>
        
        <div className="space-y-4">
          {/* Crew Information */}
          {vessel.crew && (
            <div className="bg-blue-50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Current Crew</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Captain</span>
                  <span className="font-medium text-gray-900">{vessel.crew.captain}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Chief Engineer</span>
                  <span className="font-medium text-gray-900">{vessel.crew.chiefEngineer}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Crew</span>
                  <span className="font-medium text-gray-900">{vessel.crew.totalCrew} persons</span>
                </div>
                {vessel.crew.crewMembers && vessel.crew.crewMembers.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-blue-200">
                    <div className="text-xs text-gray-600 mb-2">Key Personnel</div>
                    <div className="space-y-1">
                      {vessel.crew.crewMembers.slice(0, 3).map((member) => (
                        <div key={member.id} className="flex justify-between text-xs">
                          <span className="text-gray-600">{member.position}</span>
                          <span className="text-gray-900">{member.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Operational Status */}
          {vessel.operations && (
            <div className="bg-green-50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Operational Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Engine Status</span>
                  <span className={`font-medium ${
                    vessel.operations.engineStatus === 'running_normal' ? 'text-green-600' : 
                    vessel.operations.engineStatus === 'running_abnormal' ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    {vessel.operations.engineStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Navigation</span>
                  <span className="font-medium text-green-600">
                    {vessel.operations.navigation.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Communication</span>
                  <span className={`font-medium ${
                    vessel.operations.communication === 'all_systems_ok' ? 'text-green-600' : 
                    vessel.operations.communication === 'partial_outage' ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    {vessel.operations.communication.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Speed</span>
                  <span className="font-medium text-gray-900">{vessel.operations.speed} knots</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Fuel Level</span>
                  <span className="font-medium text-gray-900">{vessel.operations.fuelLevel}%</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}