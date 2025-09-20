'use client';

import GradeForm from './components/gradeform';
import { Grade } from '@commercialapp/ui';
import { useRouter } from 'next/navigation';

export default function AddGradePage() {
  const router = useRouter();

  const handleSubmit = (data: Grade) => {
    // Handle successful submission
    router.push('/grades');
  };

  const handleCancel = () => {
    router.push('/grades');
  };

  return (
    <GradeForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      mode="add"
    />
  );
} 