'use client';

import { useEffect, useState } from 'react';
import { getCommodityById, Commodity } from '@commercialapp/ui';
import { EntityTable } from '@commercialapp/ui';
import type { ColumnMeta } from '@commercialapp/ui';
import { getCommodity, deleteCommodity } from '@commercialapp/ui';
import { DynamicDeleteDialog } from '@commercialapp/ui';
import { 
  showSuccessNotification, 
  showErrorNotification,
  showCreatedNotification,
  showUpdatedNotification,
  showDeletedNotification 
} from '@commercialapp/ui/src/components/ui/react-hot-toast-notifications'

export default function CommodityExplorer() {
  const [commoditiesData, setCommodities] = useState<Commodity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commodityToDelete, setCommodityToDelete] = useState<Commodity | null>(null);
  const [editingCommodity, setEditingCommodity] = useState<Commodity | null>(null);

  const loadCommodities = async () => {
    setIsLoading(true);
    try {
      const res = await getCommodity();
      setCommodities(res.data);
    } catch (error) {
      console.error('Error loading commodities:', error);
      showErrorNotification({ 
        title: "Loading Error",
        description: "Failed to load commodities. Please try again." 
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadCommodities();
  }, []);

  const commodityColumnsMeta: ColumnMeta<Commodity>[] = [
    { key: 'Id', title: 'ID', isNumeric: true, isOptional: true },
    { key: 'Code', title: 'Code', isOptional: false },
    { key: 'Name', title: 'Name', isOptional: false },
    { key: 'IsActive', title: 'Active', isOptional: false, isBoolean: true },
  ];

  const handleCommoditySaved = () => {
    setShowForm(false);
    setEditingCommodity(null);
    loadCommodities();
    
    if (editingCommodity) {
      showUpdatedNotification("Commodity");
    } else {
      showCreatedNotification("Commodity");
    }
  };

  const handleDeleteCommodity = (commodity: Commodity) => {
    setCommodityToDelete(commodity);
    setDeleteDialogOpen(true);
  };

  const handleEditCommodity = async (commodity: Commodity) => {
    try {
      if (commodity.Id) {
        const response = await getCommodityById(commodity.Id);
        setEditingCommodity(response.data);
        setShowForm(true);
      }
    } catch (error) {
      console.error('Error loading commodity for edit:', error);
      showErrorNotification({ 
        title: "Loading Error",
        description: "Failed to load commodity details. Please try again." 
      });
    }
  };

  const confirmDeleteCommodity = async () => {
    if (commodityToDelete?.Id) {
      try {
        await deleteCommodity(commodityToDelete.Id);
        showDeletedNotification("Commodity");
        loadCommodities();
      } catch (error) {
        console.error('Error deleting commodity:', error);
        showErrorNotification({ 
          title: "Delete Error",
          description: "Failed to delete commodity. Please try again." 
        });
      }
    }
    setDeleteDialogOpen(false);
    setCommodityToDelete(null);
  };

  const handleAddCommodity = () => {
    setEditingCommodity(null);
    setShowForm(true);
  };

  if (showForm) {
    // TODO: Create CommodityForm component
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">
          {editingCommodity ? 'Edit Commodity' : 'Add Commodity'}
        </h2>
        <p className="text-gray-600">Commodity form will be implemented here.</p>
        <div className="mt-4 space-x-2">
          <button
            onClick={() => {
              setShowForm(false);
              setEditingCommodity(null);
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading commodities...</div>
      </div>
    );
  }

  return (
    <>
      <EntityTable<Commodity>
        title="Commodities"
        data={commoditiesData}
        columnsMeta={commodityColumnsMeta}
        filterKey="Id"
        onShowForm={handleAddCommodity}
        onDelete={handleDeleteCommodity}
        onEdit={handleEditCommodity}
        onRowClick={handleEditCommodity}
      />
      <DynamicDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Commodity"
        description={
          commodityToDelete ? `Are you sure you want to delete commodity "${commodityToDelete.Name}"? This action cannot be undone.` : ''
        }
        onConfirm={confirmDeleteCommodity}
      />
    </>
  );
}
