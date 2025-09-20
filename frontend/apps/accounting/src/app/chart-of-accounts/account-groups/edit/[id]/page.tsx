"use client";

import React from 'react';
import CreateAccountGroupPage from '../../create/page';

interface EditAccountGroupPageProps {
  params: {
    id: string;
  };
}

export default function EditAccountGroupPage({ params }: EditAccountGroupPageProps) {
  const { id } = params;
  
  // Pass the ID to the create page component for edit mode
  return <CreateAccountGroupPage editId={id} />;
}
