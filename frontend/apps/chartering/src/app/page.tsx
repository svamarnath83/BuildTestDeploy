'use client';

import EstimatesPage from './estimates/page';
import ProtectedRoute from './components/ProtectedRoute';
import { AppLayout, SimpleCache } from '@commercialapp/ui';

export default function Home() {
  return (
    <div>
      <SimpleCache appName="Chartering" />
      <ProtectedRoute>
        <EstimatesPage /> 
      </ProtectedRoute>
    </div>
  );
}
