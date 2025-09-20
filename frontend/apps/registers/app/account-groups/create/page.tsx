'use client';

import { useRouter } from 'next/navigation';
import { AccountGroup } from '../../../../../packages/ui/libs/registers/account-groups/models';
import AccountGroupForm from '../components/AccountGroupForm';

export default function CreateAccountGroupPage() {
  const router = useRouter();

  const handleSubmit = async (accountGroupData: AccountGroup) => {
    // The AccountGroupForm already handled the API call and validation
    // Just navigate back to the main page
    router.push('/account-groups');
  };

  const handleCancel = () => {
    router.push('/account-groups');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create New Account Group</h1>
            <p className="text-gray-600 mt-1">Fill in the details below to create a new account group.</p>
          </div>

          <AccountGroupForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
