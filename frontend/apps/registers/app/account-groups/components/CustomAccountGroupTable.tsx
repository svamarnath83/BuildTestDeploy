import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AccountGroup } from '../../../../../packages/ui/libs/registers/account-groups/models';
import { AccountGroupsOrchestrator } from '../libs/accountGroupsService';

interface CustomAccountGroupTableProps {
    accountGroups: AccountGroup[];
    onAccountGroupUpdated?: (group: AccountGroup) => Promise<void>;
    onAccountGroupDeleted?: (id: string | number) => Promise<void>;
    onAccountGroupCreated?: () => Promise<void>;
}

const columns = [
    { key: "description", label: "Description" },
    { key: "level1Name", label: "Level 1 Name" },
    { key: "level1Code", label: "Level 1 Code" },
    { key: "level2Name", label: "Level 2 Name" },
    { key: "level2Code", label: "Level 2 Code" },
    { key: "level3Name", label: "Level 3 Name" },
    { key: "level3Code", label: "Level 3 Code" },
    { key: "ifrsReference", label: "IFRS Reference" },
    { key: "saftCode", label: "SAFT Code" },
];

const actTypeOptions = ['Balance', 'Profit & Loss'];

const CustomAccountGroupTable: React.FC<CustomAccountGroupTableProps> = ({ accountGroups = [], onAccountGroupUpdated, onAccountGroupDeleted, onAccountGroupCreated }) => {
    const router = useRouter();
    const orchestrator = new AccountGroupsOrchestrator();
    const [editingId, setEditingId] = useState<string | number | null>(null);
    const [editingGroup, setEditingGroup] = useState<AccountGroup | null>(null);

    const [deletingId, setDeletingId] = useState<number | null>(null);

    const [newAccountGroup, setNewAccountGroup] = useState({
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
        actType: '',
    });
    const [isCreating, setIsCreating] = useState(false);

    // derive unique, non-empty group codes for the datalist suggestions
    const uniqueGroupCodes = React.useMemo(() => {
        const codes = accountGroups
            .map(g => g.groupCode?.trim())
            .filter((c): c is string => !!c);
        return Array.from(new Set(codes));
    }, [accountGroups]);

    const handleEdit = (group: AccountGroup) => {
        setEditingId(group.id);
        setEditingGroup(group);
    };

    const handleFieldChange = (field: keyof AccountGroup, value: string) => {
        if (editingGroup) setEditingGroup({ ...editingGroup, [field]: value });
    };

    const handleSaveEdit = async () => {
        if (!editingGroup || !onAccountGroupUpdated) return;
        try {
            const accountGroupData = {
                groupCode: editingGroup.groupCode?.trim() || '',
                description: editingGroup.description?.trim() || '',
                level1Name: editingGroup.level1Name?.trim() || undefined,
                level1Code: editingGroup.level1Code?.trim() || undefined,
                level2Name: editingGroup.level2Name?.trim() || undefined,
                level2Code: editingGroup.level2Code?.trim() || undefined,
                level3Name: editingGroup.level3Name?.trim() || undefined,
                level3Code: editingGroup.level3Code?.trim() || undefined,
                ifrsReference: editingGroup.ifrsReference?.trim() || undefined,
                saftCode: editingGroup.saftCode?.trim() || undefined,
                actType: editingGroup.actType?.trim() || undefined,
            };

            await orchestrator.validateAndUpdateAccountGroup(editingGroup.id, accountGroupData);
            await onAccountGroupUpdated(editingGroup);
            setEditingId(null);
            setEditingGroup(null);
            alert('Account group updated successfully!');
        } catch (err: any) {
            console.error('Failed to update account group:', err);
            alert('Failed to update account group: ' + (err.message || 'Unknown error'));
        }
    };

    const handleCreate = async () => {
        if (isCreating) return;
        if (!newAccountGroup.groupCode?.trim()) { alert('Group code is required'); return; }
        if (!newAccountGroup.description?.trim()) { alert('Description is required'); return; }

        setIsCreating(true);
        try {
            const accountGroupData = {
                groupCode: newAccountGroup.groupCode.trim(),
                description: newAccountGroup.description.trim(),
                level1Name: newAccountGroup.level1Name.trim() || undefined,
                level1Code: newAccountGroup.level1Code.trim() || undefined,
                level2Name: newAccountGroup.level2Name.trim() || undefined,
                level2Code: newAccountGroup.level2Code.trim() || undefined,
                level3Name: newAccountGroup.level3Name.trim() || undefined,
                level3Code: newAccountGroup.level3Code.trim() || undefined,
                ifrsReference: newAccountGroup.ifrsReference.trim() || undefined,
                saftCode: newAccountGroup.saftCode.trim() || undefined,
                actType: newAccountGroup.actType.trim() || undefined,
            };

            await orchestrator.validateAndCreateAccountGroup(accountGroupData);

            setNewAccountGroup({
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
                actType: '',
            });

            if (onAccountGroupCreated) await onAccountGroupCreated();
            alert('Account group created successfully');
        } catch (error: any) {
            alert('Failed to create account group: ' + (error?.message ?? 'Unknown error'));
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id?: number) => {
        e.stopPropagation();
        if (!id) return;
        if (!confirm('Delete this account group?')) return;

        try {
            setDeletingId(id);
            await orchestrator.deleteAccountGroup(id);
            if (onAccountGroupDeleted) await onAccountGroupDeleted(id);
        } catch (err) {
            console.error('Delete failed', err);
            alert('Failed to delete account group');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="overflow-x-auto">
            <div className="shadow-sm bg-white rounded-md border border-gray-200">
                <div className="p-2 overflow-auto">
                    {accountGroups.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No account groups found.</div>
                    ) : (
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group Code</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Type</th>
                                    {columns.map((col) => (
                                        <th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col.label}</th>
                                    ))}
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-100">
                                {/* create row */}
                                <tr className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-600"></td>

                                    <td className="px-4 py-3">
                                        <input
                                            type="text"
                                            list="groupCodes"
                                            value={newAccountGroup.groupCode}
                                            onChange={(e) => setNewAccountGroup({ ...newAccountGroup, groupCode: e.target.value })}
                                            placeholder="Enter group code"
                                            className="w-full text-sm text-gray-800 border-b border-gray-200 focus:border-indigo-500 focus:outline-none py-1"
                                            maxLength={10}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <datalist id="groupCodes">
                                            {uniqueGroupCodes.map((code, i) => <option key={i} value={code} />)}
                                        </datalist>
                                    </td>

                                    <td className="px-4 py-3">
                                        <select
                                            value={newAccountGroup.actType}
                                            onChange={(e) => setNewAccountGroup({ ...newAccountGroup, actType: e.target.value })}
                                            className="text-sm text-gray-700 bg-transparent border-b border-gray-200 focus:border-indigo-500 py-1 w-full"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <option value="">Select</option>
                                            {actTypeOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    </td>

                                    <td className="px-4 py-3">
                                        <input
                                            type="text"
                                            value={newAccountGroup.description}
                                            onChange={(e) => setNewAccountGroup({ ...newAccountGroup, description: e.target.value })}
                                            placeholder="Description"
                                            className="w-full text-sm text-gray-800 border-b border-gray-200 focus:border-indigo-500 focus:outline-none py-1"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>

                                    <td className="px-4 py-3">
                                        <input
                                            type="text"
                                            value={newAccountGroup.level1Name}
                                            onChange={(e) => setNewAccountGroup({ ...newAccountGroup, level1Name: e.target.value })}
                                            placeholder="Level 1 name"
                                            className="w-full text-sm text-gray-800 border-b border-gray-200 focus:border-indigo-500 focus:outline-none py-1"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>

                                    <td className="px-4 py-3">
                                        <input
                                            type="text"
                                            value={newAccountGroup.level1Code}
                                            onChange={(e) => setNewAccountGroup({ ...newAccountGroup, level1Code: e.target.value })}
                                            placeholder="Level 1 code"
                                            className="w-full text-sm text-gray-800 border-b border-gray-200 focus:border-indigo-500 focus:outline-none py-1"
                                            onClick={(e) => e.stopPropagation()}
                                            maxLength={10}
                                        />
                                    </td>

                                    <td className="px-4 py-3">
                                        <input
                                            type="text"
                                            value={newAccountGroup.level2Name}
                                            onChange={(e) => setNewAccountGroup({ ...newAccountGroup, level2Name: e.target.value })}
                                            placeholder="Level 2 name"
                                            className="w-full text-sm text-gray-800 border-b border-gray-200 focus:border-indigo-500 focus:outline-none py-1"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>

                                    <td className="px-4 py-3">
                                        <input
                                            type="text"
                                            value={newAccountGroup.level2Code}
                                            onChange={(e) => setNewAccountGroup({ ...newAccountGroup, level2Code: e.target.value })}
                                            placeholder="Level 2 code"
                                            className="w-full text-sm text-gray-800 border-b border-gray-200 focus:border-indigo-500 focus:outline-none py-1"
                                            onClick={(e) => e.stopPropagation()}
                                            maxLength={10}
                                        />
                                    </td>

                                    <td className="px-4 py-3">
                                        <input
                                            type="text"
                                            value={newAccountGroup.level3Name}
                                            onChange={(e) => setNewAccountGroup({ ...newAccountGroup, level3Name: e.target.value })}
                                            placeholder="Level 3 name"
                                            className="w-full text-sm text-gray-800 border-b border-gray-200 focus:border-indigo-500 focus:outline-none py-1"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>

                                    <td className="px-4 py-3">
                                        <input
                                            type="text"
                                            value={newAccountGroup.level3Code}
                                            onChange={(e) => setNewAccountGroup({ ...newAccountGroup, level3Code: e.target.value })}
                                            placeholder="Level 3 code"
                                            className="w-full text-sm text-gray-800 border-b border-gray-200 focus:border-indigo-500 focus:outline-none py-1"
                                            onClick={(e) => e.stopPropagation()}
                                            maxLength={10}
                                        />
                                    </td>

                                    <td className="px-4 py-3">
                                        <input
                                            type="text"
                                            value={newAccountGroup.ifrsReference}
                                            onChange={(e) => setNewAccountGroup({ ...newAccountGroup, ifrsReference: e.target.value })}
                                            placeholder="IFRS reference"
                                            className="w-full text-sm text-gray-800 border-b border-gray-200 focus:border-indigo-500 focus:outline-none py-1"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>

                                    <td className="px-4 py-3">
                                        <input
                                            type="text"
                                            value={newAccountGroup.saftCode}
                                            onChange={(e) => setNewAccountGroup({ ...newAccountGroup, saftCode: e.target.value })}
                                            placeholder="SAFT code"
                                            className="w-full text-sm text-gray-800 border-b border-gray-200 focus:border-indigo-500 focus:outline-none py-1"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>

                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleCreate(); }}
                                            disabled={isCreating}
                                            className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white focus:outline-none ${
                                                isCreating ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                                            }`}
                                        >
                                            {isCreating ? 'Creating...' : 'Create'}
                                        </button>
                                    </td>
                                </tr>

                                {accountGroups.map((group: AccountGroup, index: number) => {
                                    const isEditing = editingId === group.id;
                                    const displayGroup = isEditing ? editingGroup : group;

                                    if (!displayGroup) return null;

                                    return (
                                        <tr
                                            key={group.id}
                                            className={`cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50`}
                                            onClick={() => { if (!isEditing) handleEdit(group); }}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{index + 1}</td>

                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {isEditing ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            list="groupCodes"
                                                            value={displayGroup.groupCode || ''}
                                                            onChange={(e) => handleFieldChange('groupCode', e.target.value)}
                                                            className="border border-gray-300 rounded px-2 py-1 w-full"
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                        <datalist id="groupCodes">
                                                            {uniqueGroupCodes.map((code, i) => <option key={i} value={code} />)}
                                                        </datalist>
                                                    </>
                                                ) : (
                                                    displayGroup.groupCode || '-'
                                                )}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {isEditing ? (
                                                    <select
                                                        value={displayGroup.actType || ''}
                                                        onChange={(e) => handleFieldChange('actType', e.target.value)}
                                                        className="border border-gray-300 rounded px-2 py-1 w-full"
                                                    >
                                                        <option value="">Select Account Type</option>
                                                        {actTypeOptions.map((option) => (
                                                            <option key={option} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    displayGroup.actType || '-'
                                                )}
                                            </td>

                                            {columns.map((col) => (
                                                <td key={col.key} className="px-4 py-3 text-sm text-gray-600">
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            value={displayGroup[col.key as keyof AccountGroup] || ''}
                                                            onChange={(e) => handleFieldChange(col.key as keyof AccountGroup, e.target.value)}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-1.5"
                                                            maxLength={col.key.includes('Code') ? 10 : col.key.includes('Name') ? 50 : 100}
                                                        />
                                                    ) : (
                                                        (group[col.key as keyof AccountGroup] ?? '') !== ''
                                                            ? group[col.key as keyof AccountGroup]
                                                            : '-'
                                                    )}
                                                </td>
                                            ))}

                                            <td className="px-4 py-3 text-right">
                                                {isEditing ? (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            className="text-green-600 hover:text-green-900 p-1"
                                                            onClick={(e) => { e.stopPropagation(); handleSaveEdit(); }}
                                                            title="Save"
                                                        >
                                                            {/* Save icon */}
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            className="text-gray-600 hover:text-gray-900 p-1"
                                                            onClick={(e) => { e.stopPropagation(); setEditingId(null); setEditingGroup(null); }}
                                                            title="Cancel"
                                                        >
                                                            {/* Cancel icon */}
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <button
                                                            className="p-1 text-indigo-600 hover:text-indigo-800"
                                                            onClick={(e) => { e.stopPropagation(); router.push(`/account-groups/edit?id=${group.id}`); }}
                                                            title="Edit"
                                                        >
                                                            {/* Edit icon */}
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-5-6l5 5" />
                                                            </svg>
                                                        </button>

                                                        <button
                                                            className="p-1 text-red-600 hover:text-red-800"
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(e, group.id); }}
                                                            disabled={deletingId === group.id}
                                                            title="Delete"
                                                        >
                                                            {/* Delete icon */}
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomAccountGroupTable;
