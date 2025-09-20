'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EntityTable } from '@commercialapp/ui';
import type { ColumnMeta } from '@commercialapp/ui';
import { DynamicDeleteDialog } from '@commercialapp/ui';
import { 
  showSuccessNotification, 
  showErrorNotification,
  showDeletedNotification 
} from '@commercialapp/ui';
import { getEstimates, deleteEstimate } from '../../cargo-analysis/libs/estimate-api-services';
import { ApiModel } from '../../cargo-analysis/libs/api-model-converter';

export default function EstimateExplorer() {
  const [estimates, setEstimates] = useState<ApiModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [estimateToDelete, setEstimateToDelete] = useState<ApiModel | null>(null);
  const router = useRouter();

  const loadEstimates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getEstimates();
      setEstimates(response.data);
    } catch (err: unknown) {
      console.error('Failed to load estimates:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load estimates';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEstimates();
  }, []);

  const estimateColumnsMeta: ColumnMeta<ApiModel>[] = [
    { key: 'id', title: 'ID', isNumeric: true, isOptional: true },
    { key: 'estimateNo', title: 'Estimate No', isOptional: false },
    { key: 'estimateDate', title: 'Date', isOptional: false },
    { key: 'shipType', title: 'Type', isOptional: false },
    { key: 'ship', title: 'Ship', isOptional: false },
    { key: 'commodity', title: 'Commodity', isOptional: false },
    { key: 'loadPorts', title: 'Load Ports', isOptional: false },
    { key: 'dischargePorts', title: 'Discharge Ports', isOptional: false },
    { key: 'status', title: 'Status', isOptional: false },
    { key: 'voyageNo', title: 'Voyage No', isOptional: true },
  ];

  const handleRowClick = (row: ApiModel) => {
    router.push(`/estimates/${row.id}`);
  };

  const handleDeleteEstimate = (estimate: ApiModel) => {
    setEstimateToDelete(estimate);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteEstimate = async () => {
    console.log('confirmDeleteEstimate called for estimate:', estimateToDelete);
    if (!estimateToDelete || !estimateToDelete.id) return;
    
    try {
      await deleteEstimate(estimateToDelete.id);
      setEstimates(prev => prev.filter(e => e.id !== estimateToDelete.id));
      showDeletedNotification("Estimate");
    } catch (error: unknown) {
      console.error('Failed to delete estimate:', error);
      showErrorNotification({ description: "Failed to delete estimate" });
    } finally {
      setDeleteDialogOpen(false);
      setEstimateToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading estimates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Estimates</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadEstimates}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <EntityTable<ApiModel>
        title="Estimates"
        data={estimates}
        onShowForm={() => router.push('/cargo-analysis')}
        columnsMeta={estimateColumnsMeta}
        filterKey="estimateNo"
        onRowClick={handleRowClick}
        onDelete={handleDeleteEstimate}
      />
      <DynamicDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Estimate"
        description={
          estimateToDelete ? `Are you sure you want to delete estimate "${estimateToDelete.estimateNo}"? This action cannot be undone.` : ''
        }
        onConfirm={confirmDeleteEstimate}
      />
    </>
  );
} 