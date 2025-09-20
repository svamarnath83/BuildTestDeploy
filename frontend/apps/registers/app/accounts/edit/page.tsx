import React from 'react';
import AccountForm from '../components/AccountForm';

interface Props {
  searchParams?: Promise<{ id?: string }>;
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const id = params?.id ? Number(params.id) : undefined;

  return (
    <div className="p-6">
      <AccountForm id={id} />
    </div>
  );
}
