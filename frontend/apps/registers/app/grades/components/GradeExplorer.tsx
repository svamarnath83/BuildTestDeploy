'use client';

import { useEffect, useState } from 'react';
import { getGradeById, Grade } from '@commercialapp/ui';
import { EntityTable } from '@commercialapp/ui';
import type { ColumnMeta } from '@commercialapp/ui';
import { getGrade, deleteGrade } from '@commercialapp/ui';
import GradeForm from '../AddGrade/components/gradeform';
import { DynamicDeleteDialog } from '@commercialapp/ui';
import { 
  showSuccessNotification, 
  showErrorNotification,
  showCreatedNotification,
  showUpdatedNotification,
  showDeletedNotification 
} from '@commercialapp/ui/src/components/ui/react-hot-toast-notifications'

export default function GradeExplorer() {
  const [GradesData, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [gradeToDelete, setGradeToDelete] = useState<Grade | null>(null);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);

  const loadGrades = async () => {
    setIsLoading(true);
    try {
      const res = await getGrade();
      setGrades(res.data);
    } catch (error) {
      console.error('Error loading grades:', error);
      showErrorNotification({ 
        title: "Loading Error",
        description: "Failed to load grades. Please try again." 
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadGrades();
  }, []);


  const gradeColumnsMeta: ColumnMeta<Grade>[] = [
    { key: 'id', title: 'ID', isNumeric: true, isOptional: true },
    { key: 'name', title: 'Grade Name', isOptional: false },
    { key: 'price', title: 'Price', isNumeric: true, isOptional: false },
    { key: 'inUse', title: 'In Use', isOptional: false, isBoolean: true },
  ];

  const handleGradeSaved = () => {
    console.log('handleGradeSaved called');
    if(editingGrade)
      showUpdatedNotification("Grade");
    else 
      showCreatedNotification("Grade");
    
    loadGrades();
    setShowForm(false);
    setEditingGrade(null);
  };

  const handleDeleteGrade = (grade: Grade) => {
    setGradeToDelete(grade);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteGrade = async () => {
    if (!gradeToDelete || !gradeToDelete.id) return;
    try {
      await deleteGrade(gradeToDelete.id);
      setGrades(prev => prev.filter(g => g.id !== gradeToDelete.id));
      showDeletedNotification("Grade");
    } catch (error) {
      showErrorNotification({ description: "Failed to delete grade" });
    } finally {
      setDeleteDialogOpen(false);
      setGradeToDelete(null);
    }
  };

  const handleEditGrade = async (grade: Grade) => {
    if (grade.id) {
      try {
        const gradeData = await getGradeById(grade.id);
        console.log('gradeData:', gradeData);
        // Sanitize nulls to empty string for string fields only
        const sanitized = { ...gradeData.data };
        for (const key in sanitized) {
          if (sanitized[key] === null && typeof sanitized[key] !== 'number' && typeof sanitized[key] !== 'boolean') {
            sanitized[key] = '';
          }
        }
        setEditingGrade(sanitized);
        setShowForm(true);
      } catch (error) {
        console.error('Error loading grade for edit:', error);
        showErrorNotification({ 
          title: "Loading Error",
          description: "Failed to load grade details. Please try again." 
        });
      }
    } else {
      setShowForm(true);
    }
  };

  const handleAddGrade = () => {
    setEditingGrade(null);
    setShowForm(true);
  };

  if (showForm) {
    return (
      <GradeForm
        initialData={editingGrade || undefined}
        onSubmit={handleGradeSaved}
        onCancel={() => {
          setShowForm(false);
          setEditingGrade(null);
        }}
        mode={editingGrade ? 'edit' : 'add'}
      />
    );
  }

  return (
    <>
      <EntityTable<Grade>
        title="Grades"
        data={GradesData}
        columnsMeta={gradeColumnsMeta}
        filterKey="id"
        onShowForm={handleAddGrade}
        onDelete={handleDeleteGrade}
        onEdit={handleEditGrade}
        onRowClick={handleEditGrade}
      />
      <DynamicDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteGrade}
        title="Delete Grade"
        description="Are you sure you want to delete this grade? This action cannot be undone."
      />
    </>
  );
} 