'use client';

import { useParams } from 'next/navigation';
import { getEstimateDetails } from './service';
import EstimateViewer from '../components/EstimateViewer';

export default function EstimateDetailPage() {
  const params = useParams();
  const id = Number(params?.id);

  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Invalid estimate ID</p>
      </div>
    );
  }

  return (
    <EstimateViewer 
      estimateId={id} 
      getEstimateDetails={getEstimateDetails} 
    />
  );
} 