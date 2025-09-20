'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AccountGroup } from '../../../../../../packages/ui/libs/registers/account-groups/models';
import { AccountGroupsOrchestrator } from '../libs/accountGroupsService';
import AccountGroupForm from '../components/AccountGroupForm';

export default function EditAccountGroupPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [accountGroup, setAccountGroup] = useState<AccountGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orchestrator = new AccountGroupsOrchestrator();
  const id = searchParams.get('id') ? parseInt(searchParams.get('id')!) : null;

  useEffect(() => {
    if (id) {
      loadAccountGroup();
    } else {
      setError('No account group ID provided');
      setIsLoading(false);
    }
  }, [id]);

  const loadAccountGroup = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await orchestrator.getAccountGroupById(id!);
      setAccountGroup(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load account group');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (updatedAccountGroup: AccountGroup) => {
    router.push('/account-groups');
  };

  const handleCancel = () => {
    router.push('/account-groups');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading account group...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={loadAccountGroup}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!accountGroup) {
    return (
      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <p className="text-sm text-yellow-700">Account group not found</p>
      </div>
    );
  }

  return (
    <AccountGroupForm
      accountGroup={accountGroup}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
    />
  );
}
