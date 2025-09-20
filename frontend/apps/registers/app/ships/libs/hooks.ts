import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { getGrade } from '@commercialapp/ui';
import { parseVesselGradesFromInitialData, parseSpeedConsumptionsFromInitialData, getDefaultGradeItem } from './transformers';

export const useGradesData = () => {
  const [grades, setGrades] = useState<Array<{ id: number; name: string }>>([]);

  useEffect(() => {
    const loadGrades = async () => {
      try {
        const response = await getGrade();
        setGrades(response.data);
      } catch (error) {
        console.error('Failed to load grades:', error);
      }
    };
    loadGrades();
  }, []);

  // Memoize grades to prevent unnecessary re-renders
  return useMemo(() => grades, [grades]);
};

export const useInitialDataProcessing = (initialData: any) => {
  const [gradeItems, setGradeItems] = useState<any[]>(() => {
    const parsedGrades = parseVesselGradesFromInitialData(initialData);
    return parsedGrades.length > 0 ? parsedGrades : [getDefaultGradeItem(initialData)];
  });

  const [speedConsumptions, setSpeedConsumptions] = useState(() => {
    return parseSpeedConsumptionsFromInitialData(initialData);
  });

  // Memoize state setters to prevent infinite loops
  const memoizedSetGradeItems = useCallback(setGradeItems, []);
  const memoizedSetSpeedConsumptions = useCallback(setSpeedConsumptions, []);

  // Populate grade names when grades data is loaded - memoized to prevent infinite loops
  const updateGradeNames = useCallback((grades: Array<{ id: number; name: string }>, currentGradeItems: any[]) => {
    if (grades.length > 0 && currentGradeItems.length > 0) {
      const updatedGradeItems = currentGradeItems.map(grade => {
        if (grade.gradeId > 0) {
          const gradeData = grades.find(g => g.id === grade.gradeId);
          return {
            ...grade,
            gradeName: gradeData?.name || ''
          };
        }
        return grade;
      });
      memoizedSetGradeItems(updatedGradeItems);
    }
  }, [memoizedSetGradeItems]); // Only depend on the memoized setter

  return {
    gradeItems,
    setGradeItems: memoizedSetGradeItems,
    speedConsumptions,
    setSpeedConsumptions: memoizedSetSpeedConsumptions,
    updateGradeNames
  };
};
