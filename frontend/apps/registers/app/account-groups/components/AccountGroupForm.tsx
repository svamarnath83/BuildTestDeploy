'use client';

import React, { useState, useEffect } from 'react';
import { AccountGroup } from '../../../../../packages/ui/libs/registers/account-groups/models';
import { AccountGroupsOrchestrator } from '../libs/accountGroupsService';

interface AccountGroupFormProps {
  accountGroup?: AccountGroup;
  onSubmit: (accountGroup: AccountGroup) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function AccountGroupForm({ 
  accountGroup, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: AccountGroupFormProps) {
  const [formData, setFormData] = useState({
    actType: '',  // Add this
    groupCode: '',
    description: '',
    level1Name: '',
    level1Code: '',
    level2Name: '',
    level2Code: '',
    level3Name: '',
    level3Code: '',
    ifrsReference: '',
    saftCode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const orchestrator = new AccountGroupsOrchestrator();

  useEffect(() => {
    if (accountGroup) {
      setFormData({
        actType: accountGroup.actType || '',  // Add this
        groupCode: accountGroup.groupCode || '',
        description: accountGroup.description || '',
        level1Name: accountGroup.level1Name || '',
        level1Code: accountGroup.level1Code || '',
        level2Name: accountGroup.level2Name || '',
        level2Code: accountGroup.level2Code || '',
        level3Name: accountGroup.level3Name || '',
        level3Code: accountGroup.level3Code || '',
        ifrsReference: accountGroup.ifrsReference || '',
        saftCode: accountGroup.saftCode || '',
      });
    }
  }, [accountGroup]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.actType.trim()) {  // Add validation for actType
      newErrors.actType = 'Account Type is required';
    }

    if (!formData.groupCode.trim()) {
      newErrors.groupCode = 'Group code is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any previous errors
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        actType: formData.actType.trim(),  // Add this
        groupCode: formData.groupCode.trim(),
        description: formData.description.trim(),
        level1Name: formData.level1Name.trim() || undefined,
        level1Code: formData.level1Code.trim() || undefined,
        level2Name: formData.level2Name.trim() || undefined,
        level2Code: formData.level2Code.trim() || undefined,
        level3Name: formData.level3Name.trim() || undefined,
        level3Code: formData.level3Code.trim() || undefined,
        ifrsReference: formData.ifrsReference.trim() || undefined,
        saftCode: formData.saftCode.trim() || undefined,
      };

      let result: AccountGroup;
      if (accountGroup?.id) {
        result = await orchestrator.validateAndUpdateAccountGroup(accountGroup.id, submitData);
      } else {
        result = await orchestrator.validateAndCreateAccountGroup(submitData);
      }

      onSubmit(result);
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: 'An unexpected error occurred' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {accountGroup ? 'Edit Account Group' : 'Create New Account Group'}
          </h2>

          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded">
              <p className="text-red-700">{errors.general}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>  {/* Add this block for actType */}
              <label htmlFor="actType" className="block text-sm font-medium text-gray-700 mb-2">
                Account Type *
              </label>
              <input
                type="text"
                id="actType"
                name="actType"
                value={formData.actType}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.actType ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter account type (e.g., Balance)"
                maxLength={50}
              />
              {errors.actType && <p className="mt-1 text-sm text-red-600">{errors.actType}</p>}
            </div>

            <div>
              <label htmlFor="groupCode" className="block text-sm font-medium text-gray-700 mb-2">
                Group Code *
              </label>
              <input
                type="text"
                id="groupCode"
                name="groupCode"
                value={formData.groupCode}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.groupCode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter group code"
                maxLength={10}
              />
              {errors.groupCode && <p className="mt-1 text-sm text-red-600">{errors.groupCode}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter description"
                maxLength={100}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div>
              <label htmlFor="level1Name" className="block text-sm font-medium text-gray-700 mb-2">
                Level 1 Name
              </label>
              <input
                type="text"
                id="level1Name"
                name="level1Name"
                value={formData.level1Name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter level 1 name"
                maxLength={50}
              />
            </div>

            <div>
              <label htmlFor="level1Code" className="block text-sm font-medium text-gray-700 mb-2">
                Level 1 Code
              </label>
              <input
                type="text"
                id="level1Code"
                name="level1Code"
                value={formData.level1Code}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter level 1 code"
                maxLength={10}
              />
            </div>

            <div>
              <label htmlFor="level2Name" className="block text-sm font-medium text-gray-700 mb-2">
                Level 2 Name
              </label>
              <input
                type="text"
                id="level2Name"
                name="level2Name"
                value={formData.level2Name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter level 2 name"
                maxLength={50}
              />
            </div>

            <div>
              <label htmlFor="level2Code" className="block text-sm font-medium text-gray-700 mb-2">
                Level 2 Code
              </label>
              <input
                type="text"
                id="level2Code"
                name="level2Code"
                value={formData.level2Code}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter level 2 code"
                maxLength={10}
              />
            </div>

            <div>
              <label htmlFor="level3Name" className="block text-sm font-medium text-gray-700 mb-2">
                Level 3 Name
              </label>
              <input
                type="text"
                id="level3Name"
                name="level3Name"
                value={formData.level3Name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter level 3 name"
                maxLength={50}
              />
            </div>

            <div>
              <label htmlFor="level3Code" className="block text-sm font-medium text-gray-700 mb-2">
                Level 3 Code
              </label>
              <input
                type="text"
                id="level3Code"
                name="level3Code"
                value={formData.level3Code}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter level 3 code"
                maxLength={10}
              />
            </div>

            <div>
              <label htmlFor="ifrsReference" className="block text-sm font-medium text-gray-700 mb-2">
                IFRS Reference
              </label>
              <input
                type="text"
                id="ifrsReference"
                name="ifrsReference"
                value={formData.ifrsReference}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter IFRS reference"
                maxLength={50}
              />
            </div>

            <div>
              <label htmlFor="saftCode" className="block text-sm font-medium text-gray-700 mb-2">
                SAFT Code
              </label>
              <input
                type="text"
                id="saftCode"
                name="saftCode"
                value={formData.saftCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter SAFT code"
                maxLength={50}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : (accountGroup ? 'Update' : 'Create')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
