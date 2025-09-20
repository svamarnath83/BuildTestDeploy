'use client';

import { useEffect, useState } from 'react';
import { Vessel, getShips, deleteShip, getShipById } from '@commercialapp/ui';
import { EntityTable } from '@commercialapp/ui';
import type { ColumnMeta } from '@commercialapp/ui';
import ShipsForm from './ShipsForm';
import { DynamicDeleteDialog } from '@commercialapp/ui';
import { 
  showSuccessNotification, 
  showErrorNotification,
  showCreatedNotification,
  showUpdatedNotification,
  showDeletedNotification 
} from '@commercialapp/ui/src/components/ui/react-hot-toast-notifications';

export default function ShipExplorer() {
  const [shipsData, setShipsData] = useState<Vessel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shipToDelete, setShipToDelete] = useState<Vessel | null>(null);
  const [editingShip, setEditingShip] = useState<Vessel | null>(null);

  // load all ships
  const loadShips = async () => {
    try {
      setIsLoading(true);
      const response = await getShips();
      setShipsData(response.data);
    } catch (error) {
      console.error('Failed to load ships:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadShips();
  }, []);

  // column definition - keeping only essential columns
  const shipColumnsMeta: ColumnMeta<Vessel>[] = [
    { key: 'id', title: 'ID', isNumeric: true, isOptional: true },
    { key: 'name', title: 'Vessel Name', isOptional: false },
    { key: 'code', title: 'Code', isOptional: false },
    { key: 'vesselTypeName', title: 'Type', isOptional: false },
    { key: 'dwt', title: 'DWT', isOptional: false },
    { key: 'imo', title: 'IMO', isOptional: false },
    { key: 'runningCost', title: 'Running Cost', isOptional: false },
  ];

  const handleShipSaved = () => {
    loadShips();
    setShowForm(false);
    setEditingShip(null);
  };

  const handleDeleteShip = (ship: Vessel) => {
    setShipToDelete(ship);
    setDeleteDialogOpen(true);
  };

  const handleEditShip = async (ship: Vessel) => {
    if (ship.id) {
      try {
        const shipData = await getShipById(ship.id);
        console.log(shipData.data);
        setEditingShip(shipData.data);
      } catch (error) {
        console.error('Failed to load ship details:', error);
      }
    }
    setShowForm(true);
  };

  const confirmDeleteShip = async () => {
    if (!shipToDelete || !shipToDelete.id) return;
    try {
      await deleteShip(shipToDelete.id);
      setShipsData(prev => prev.filter(s => s.id !== shipToDelete.id));
      showDeletedNotification("Vessel");
    } catch (error) {
      showErrorNotification({ description: "Failed to delete vessel" });
    } finally {
      setDeleteDialogOpen(false);
      setShipToDelete(null);
    }
  };

  if (showForm) {
    return (
      <ShipsForm
        initialData={editingShip || undefined}
        mode={editingShip ? 'edit' : 'add'}
        onSubmit={handleShipSaved}
        onCancel={() => {
          setShowForm(false);
          setEditingShip(null);
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading vessels...</div>
      </div>
    );
  }

  return (
    <>
      <EntityTable<Vessel>
        title="Vessels"
        data={shipsData}
        columnsMeta={shipColumnsMeta}
        filterKey="id"
        onShowForm={() => {
          setEditingShip(null);
          setShowForm(true);
        }}
        onDelete={handleDeleteShip}
        onEdit={handleEditShip}
        onRowClick={handleEditShip}
      />
      <DynamicDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Vessel"
        description={
          shipToDelete ? `Are you sure you want to delete vessel "${shipToDelete.name}"? This action cannot be undone.` : ''
        }
        onConfirm={confirmDeleteShip}
      />
    </>
  );
} 