'use client';

import { useEffect, useState } from 'react';
import { getVesselTypeById, VesselType } from '@commercialapp/ui';
import { EntityTable } from '@commercialapp/ui';
import type { ColumnMeta } from '@commercialapp/ui';
import { getVesselType, deleteVesselType } from '@commercialapp/ui';
import VesselTypeForm from '../AddVesselType/components/vesseltypeform';
import { DynamicDeleteDialog } from '@commercialapp/ui';
import { 
  showSuccessNotification, 
  showErrorNotification,
  showCreatedNotification,
  showUpdatedNotification,
  showDeletedNotification 
} from '@commercialapp/ui/src/components/ui/react-hot-toast-notifications'

export default function VesselTypeExplorer() {
  const [vesselTypesData, setVesselTypes] = useState<VesselType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vesselTypeToDelete, setVesselTypeToDelete] = useState<VesselType | null>(null);
  const [editingVesselType, setEditingVesselType] = useState<VesselType | null>(null);

  const loadVesselTypes = async () => {
    setIsLoading(true);
    try {
      const res = await getVesselType();
      setVesselTypes(res.data);
    } catch (error) {
      console.error('Error loading vessel types:', error);
      showErrorNotification({ 
        title: "Loading Error",
        description: "Failed to load vessel types. Please try again." 
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadVesselTypes();
  }, []);

  const vesselTypeColumnsMeta: ColumnMeta<VesselType>[] = [
    { key: 'id', title: 'ID', isNumeric: true, isOptional: true },
    { key: 'name', title: 'Vessel Type Name', isOptional: false },
    { key: 'categoryName', title: 'Category', isOptional: false },
    { key: 'calcType', title: 'Calculation Type', isOptional: false },
  ];

  const handleVesselTypeSaved = () => {
    console.log('handleVesselTypeSaved called');
    
    // Notifications are now handled in the form component
    loadVesselTypes();
    setShowForm(false);
    setEditingVesselType(null);
  };

  const handleDeleteVesselType = (vesselType: VesselType) => {
    setVesselTypeToDelete(vesselType);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteVesselType = async () => {
    if (!vesselTypeToDelete || !vesselTypeToDelete.id) return;
    try {
      await deleteVesselType(vesselTypeToDelete.id);
      setVesselTypes(prev => prev.filter(vt => vt.id !== vesselTypeToDelete.id));
      showDeletedNotification("Vessel Type");
    } catch (error) {
      showErrorNotification({ description: "Failed to delete vessel type" });
    } finally {
      setDeleteDialogOpen(false);
      setVesselTypeToDelete(null);
    }
  };

  const handleEditVesselType = async (vesselType: VesselType) => {
    if (vesselType.id) {
      try {
        const vesselTypeData = await getVesselTypeById(vesselType.id);
        console.log('vesselTypeData:', vesselTypeData);
        
        // Sanitize nulls to empty string for string fields only
        const sanitized = { ...vesselTypeData.data };
        for (const key in sanitized) {
          if (sanitized[key] === null && typeof sanitized[key] !== 'number' && typeof sanitized[key] !== 'boolean') {
            sanitized[key] = '';
          }
        }
        
        setEditingVesselType(sanitized);
        setShowForm(true);
      } catch (error) {
        console.error('Error loading vessel type for edit:', error);
        showErrorNotification({ 
          title: "Loading Error",
          description: "Failed to load vessel type details. Please try again." 
        });
      }
    } else {
      setShowForm(true);
    }
  };

  const handleAddVesselType = () => {
    setEditingVesselType(null);
    setShowForm(true);
  };

  if (showForm) {
    return (
      <VesselTypeForm
        initialData={editingVesselType || undefined}
        onSubmit={handleVesselTypeSaved}
        onCancel={() => {
          setShowForm(false);
          setEditingVesselType(null);
        }}
        mode={editingVesselType ? 'edit' : 'add'}
      />
    );
  }

  return (
    <>
      <EntityTable<VesselType>
        title="Vessel Types"
        data={vesselTypesData}
        columnsMeta={vesselTypeColumnsMeta}
        filterKey="id"
        onShowForm={handleAddVesselType}
        onDelete={handleDeleteVesselType}
        onEdit={handleEditVesselType}
        onRowClick={handleEditVesselType}
      />
      <DynamicDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteVesselType}
        title="Delete Vessel Type"
        description="Are you sure you want to delete this vessel type? This action cannot be undone."
      />
    </>
  );
}
