'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  pageWrapper,
  sectionContainer,
  topBar,
  buttonBack,
  buttonSave,
  heading,
  EntityTable,
  type ColumnDef
} from '@commercialapp/ui';
import { Plus, Ship, Clock, CheckCircle, XCircle, Edit, Eye } from 'lucide-react';
import Link from 'next/link';
import { getVoyages } from '../libs/voyage-services';
import type { Voyage } from '../libs/voyage-models';

export default function VoyageExplorer() {
  const [voyages, setVoyages] = useState<Voyage[]>([]);
  const [loading, setLoading] = useState(true);

  // Define table columns
  const columns: ColumnDef<Voyage>[] = [
    {
      accessorKey: 'voyageNo',
      header: 'Voyage No',
      enableSorting: true,
    },
    {
      accessorKey: 'vesselName',
      header: 'Vessel',
      enableSorting: true,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      enableSorting: true,
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const getStatusIcon = () => {
          switch (status) {
            case 'Planning': return <Clock className="h-4 w-4 text-orange-500" />;
            case 'Active': return <Ship className="h-4 w-4 text-blue-500" />;
            case 'Completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'Cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
            default: return null;
          }
        };
        
        return (
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            {status}
          </div>
        );
      },
    },
    {
      accessorKey: 'estimatedDeparture',
      header: 'Est. Departure',
      enableSorting: true,
      cell: ({ row }) => {
        const date = row.getValue('estimatedDeparture') as string;
        return date ? new Date(date).toLocaleDateString() : '-';
      },
    },
    {
      accessorKey: 'estimatedArrival',
      header: 'Est. Arrival',
      enableSorting: true,
      cell: ({ row }) => {
        const date = row.getValue('estimatedArrival') as string;
        return date ? new Date(date).toLocaleDateString() : '-';
      },
    },
    {
      accessorKey: 'totalDistance',
      header: 'Distance (NM)',
      enableSorting: true,
      cell: ({ row }) => {
        const distance = row.getValue('totalDistance') as number;
        return distance ? distance.toLocaleString() : '-';
      },
    }
  ];

  // Load voyages on component mount
  useEffect(() => {
    const loadVoyages = async () => {
      try {
        setLoading(true);
        const response = await getVoyages();
        setVoyages(response.data || []);
      } catch (error) {
        console.error('Failed to load voyages:', error);
        setVoyages([]);
      } finally {
        setLoading(false);
      }
    };

    loadVoyages();
  }, []);

  // Handle row actions
  const handleView = (voyage: Voyage) => {
    window.location.href = `/voyages/${voyage.id}`;
  };

  const handleEdit = (voyage: Voyage) => {
    window.location.href = `/voyages/${voyage.id}/edit`;
  };

  const rowActions = [
    {
      icon: <Eye className="h-4 w-4" />,
      label: 'View',
      onClick: handleView,
    },
    {
      icon: <Edit className="h-4 w-4" />,
      label: 'Edit',
      onClick: handleEdit,
    }
  ];

  if (loading) {
    return (
      <div className={pageWrapper}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading voyages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={pageWrapper}>
      <div className={topBar}>
        <h1 className={heading}>Voyages</h1>
        <div className="flex gap-2">
          <Link href="/voyages/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Voyage
            </Button>
          </Link>
        </div>
      </div>

      <div className={sectionContainer}>
        <EntityTable
          data={voyages}
          columns={columns}
          searchKey="voyageNo"
          searchPlaceholder="Search voyages..."
          rowActions={rowActions}
          emptyMessage="No voyages found. Create your first voyage to get started."
        />
      </div>
    </div>
  );
}