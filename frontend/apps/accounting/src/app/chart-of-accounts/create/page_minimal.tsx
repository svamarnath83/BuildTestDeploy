"use client";

import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateCoAPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    router.push('/chart-of-accounts');
  };

  const handleSave = () => {
    alert('Save functionality working!');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to CoA-Explorer</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <Save className="w-4 h-4" />
            <span>Save Account</span>
          </button>
        </div>

        {/* Simple Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Create Chart of Account
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">
                Group Code
              </label>
              <input
                type="text"
                placeholder="1100"
                className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">
                Account Description
              </label>
              <input
                type="text"
                placeholder="UNB USD Bank Account"
                className="w-full px-2 py-1.5 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
