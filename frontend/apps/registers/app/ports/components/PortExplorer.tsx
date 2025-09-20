'use client';

import { useEffect, useState } from 'react';
import { getPortById, Port } from '@commercialapp/ui';
import { EntityTable } from '@commercialapp/ui';
import type { ColumnMeta } from '@commercialapp/ui';
import { getPort, deletePort } from '@commercialapp/ui';
import PortForm from '../AddPort/components/portform';
import { DynamicDeleteDialog } from '@commercialapp/ui';

import { 
  showSuccessNotification, 
  showErrorNotification,
  showCreatedNotification,
  showUpdatedNotification,
  showDeletedNotification 
} from '@commercialapp/ui/src/components/ui/react-hot-toast-notifications'

export default function PortExplorer() {
  const [PortsData, setPorts] = useState<Port[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [portToDelete, setPortToDelete] = useState<Port | null>(null);
  const [editingPort, setEditingPort] = useState<Port | null>(null);

  // Helper function to format ECA Type display
  const formatEcaType = (ecaType: string) => {
    if (!ecaType || ecaType === 'none') return 'No ECA';
    const labels = {
      'china': 'China ECA',
      'med': 'Med ECA', 
      'seca': 'SECA Zone'
    };
    return labels[ecaType as keyof typeof labels] || ecaType;
  };

  const loadPorts = async () => {
      setIsLoading(true);
      await getPort().then((res) => {
        // Parse additionalData JSON and add parsed fields to each port
        const portsWithParsedData = res.data.map((port: Port) => {
          try {
            if (port.additionalData) {
              const additionalData = JSON.parse(port.additionalData);
              return {
                ...port,
                ecaType: formatEcaType(additionalData.ecaType),
                europe: additionalData.europe || false,
                Latitude: additionalData.Latitude || null,
                Longitude: additionalData.Longitude || null,
                // Country not displayed in explorer
              };
            }
          } catch (error) {
            console.error('Error parsing additionalData for port:', port.Id, error);
          }
          return port;
        });
        
        setPorts(portsWithParsedData);
      });
      setIsLoading(false);
    
  };
  
  useEffect(() => {
    loadPorts();
  }, []);


  const portColumnsMeta: ColumnMeta<Port>[] = [
    { key: 'Id', title: 'ID', isNumeric: true, isOptional: true },
    { key: 'Name', title: 'Port Name', isOptional: false },
    { key: 'PortCode', title: 'UN/LOCODE', isOptional: false },
    { key: 'unctadCode', title: 'UNCTAD Code', isOptional: false },
    { key: 'netpasCode', title: 'NETPAS Code', isOptional: false },
    { key: 'ecaType', title: 'ECA Type', isOptional: false },
    { key: 'europe', title: 'Europe', isOptional: false, isBoolean: true },
    { key: 'historical', title: 'Historical', isOptional: false, isBoolean: true },
    { key: 'Latitude', title: 'Latitude', isOptional: true },
    { key: 'Longitude', title: 'Longitude', isOptional: true },
  ];

  const handlePortSaved = () => {
    console.log('handlePortSaved called');
   
    loadPorts();
    setShowForm(false);
    setEditingPort(null);
  };

  const handleDeletePort = (port: Port) => {
    console.log('handleDeletePort called for port:', port);
    setPortToDelete(port);
    setDeleteDialogOpen(true);
  };

  const handleEditPort = async (port: Port) => {
    if (port.Id) {
      const portData = await getPortById(port.Id);
      console.log('portData:', portData);
      // Sanitize nulls to empty string for string fields only
      const sanitized = { ...portData.data };
      for (const key in sanitized) {
        if (sanitized[key] === null && typeof sanitized[key] !== 'number' && typeof sanitized[key] !== 'boolean') {
          sanitized[key] = '';
        }
      }
      
      // Load data from additionalData if it exists
      if (sanitized.additionalData) {
        try {
          const additionalData = JSON.parse(sanitized.additionalData);
          const fieldsToLoad = ['Latitude', 'Longitude', 'ecaType', 'europe'];
          
          fieldsToLoad.forEach(field => {
            if (additionalData[field] !== undefined) {
              sanitized[field] = additionalData[field];
            }
          });
        } catch (error) {
          console.error('Error parsing additionalData:', error);
        }
      }
      
      setEditingPort(sanitized);
    }
    setShowForm(true);
  };

  const confirmDeletePort = async () => {
    console.log('confirmDeletePort called for port:', portToDelete);
    if (!portToDelete || !portToDelete.Id) return;
    try {
      await deletePort(portToDelete.Id);
      setPorts(prev => prev.filter(p => p.Id !== portToDelete.Id));
      showDeletedNotification("Port");
    } catch (error) {
      showErrorNotification({ description: "Failed to delete port" });
    } finally {
      setDeleteDialogOpen(false);
      setPortToDelete(null);
    }
  };

  if (showForm) {
    console.log('Rendering PortForm with initialData:', editingPort);
    return (
      <PortForm
        initialData={editingPort || undefined}
        mode={editingPort ? 'edit' : 'add'}
        onSubmit={handlePortSaved}
        onCancel={() => {
          setShowForm(false);
          setEditingPort(null);
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading ports...</div>
      </div>
    );
  }

  return (
    <>
      <EntityTable<Port>
        title="Ports"
        data={PortsData}
        columnsMeta={portColumnsMeta}
        filterKey="Id"
        onShowForm={() => {
          setEditingPort(null);
          setShowForm(true);
        }}
        onDelete={handleDeletePort}
        onEdit={handleEditPort}
        onRowClick={handleEditPort}
      />
      <DynamicDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Port"
        description={
          portToDelete ? `Are you sure you want to delete port "${portToDelete.Name}"? This action cannot be undone.` : ''
        }
        onConfirm={confirmDeletePort}
      />
    </>
  );
}
