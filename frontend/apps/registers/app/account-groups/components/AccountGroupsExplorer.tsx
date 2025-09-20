// File deleted for clean recreation
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AccountGroup } from '../../../../../packages/ui/libs/registers/account-groups/models';
import { AccountGroupsOrchestrator } from '../libs/accountGroupsService';
import CustomAccountGroupTable from './CustomAccountGroupTable';

export default function AccountGroupsExplorer() {
  const [accountGroups, setAccountGroups] = useState<AccountGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25); // change default page size
  const orchestrator = useMemo(() => new AccountGroupsOrchestrator(), []);

  // ensure router is initialized for navigation
  const router = useRouter();
  
  const loadAccountGroups = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await orchestrator.getAllAccountGroups();
      setAccountGroups(Array.isArray(data) ? data : []);
      setPage(1); // reset to first page after reload/search
    } catch (err) {
      console.error('AccountGroupsExplorer: Error loading account groups:', err);
      setAccountGroups([]);
    } finally {
      setIsLoading(false);
    }
  }, [orchestrator]);

  useEffect(() => {
    loadAccountGroups();
  }, [loadAccountGroups]);

  const filteredAccountGroups = useMemo(() => {
    if (!searchQuery.trim()) return accountGroups;
    const query = searchQuery.toLowerCase();
    return accountGroups.filter(ag =>
      ag.actType?.toLowerCase().includes(query) ||
      ag.groupCode?.toLowerCase().includes(query) ||
      ag.description?.toLowerCase().includes(query) ||
      ag.level1Name?.toLowerCase().includes(query) ||
      ag.level1Code?.toLowerCase().includes(query) ||
      ag.level2Name?.toLowerCase().includes(query) ||
      ag.level2Code?.toLowerCase().includes(query) ||
      ag.level3Name?.toLowerCase().includes(query) ||
      ag.level3Code?.toLowerCase().includes(query) ||
      ag.ifrsReference?.toLowerCase().includes(query) ||
      ag.saftCode?.toLowerCase().includes(query)
    );
  }, [accountGroups, searchQuery]);

  const total = filteredAccountGroups.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const paginatedAccountGroups = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAccountGroups.slice(start, start + pageSize);
  }, [filteredAccountGroups, currentPage, pageSize]);

  const handlePageChange = (newPage: number) => {
    setPage(Math.min(Math.max(1, newPage), totalPages));
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1); // Reset to first page on new search
  };

  return (
    <div className="h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg border border-gray-300 flex flex-col h-full">
        <div className="border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">Account Groups</h1>
            <button
              onClick={() => router.push('/account-groups/create')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              + New
            </button>
          </div>
          <div className="relative w-80">
            <input
              placeholder="Search account groups..."
              value={searchQuery}
              onChange={e => handleSearchChange(e.target.value)}
              className="pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-hidden p-4 flex flex-col">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading account groups...</div>
            </div>
          ) : (
            <>
              <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
                <CustomAccountGroupTable
                  accountGroups={paginatedAccountGroups}
                  onAccountGroupUpdated={loadAccountGroups}
                  onAccountGroupDeleted={loadAccountGroups}    // <-- pass the handler here
                  onAccountGroupCreated={loadAccountGroups}
                />
              </div>

              {/* Pagination controls */}
              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {(paginatedAccountGroups.length === 0) ? 0 : ((currentPage - 1) * pageSize + 1)} - {((currentPage - 1) * pageSize + paginatedAccountGroups.length)} of {total}
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={pageSize}
                    onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                    className="border rounded px-2 py-1"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>

                  <button onClick={() => handlePageChange(1)} disabled={currentPage === 1} className="px-2 py-1 border rounded disabled:opacity-50">« First</button>
                  <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-2 py-1 border rounded disabled:opacity-50">‹ Prev</button>
                  <span className="px-2 text-sm">{currentPage} / {totalPages}</span>
                  <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-2 py-1 border rounded disabled:opacity-50">Next ›</button>
                  <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} className="px-2 py-1 border rounded disabled:opacity-50">Last »</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
