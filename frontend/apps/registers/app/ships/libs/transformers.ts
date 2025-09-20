import { SpeedConsumptionItem, TransformedSpeedConsumption } from './types';

export const transformSpeedConsumptionsForSaving = (
  speedConsumptions: SpeedConsumptionItem[], 
  gradeItems: any[]
): TransformedSpeedConsumption[] => {
  return speedConsumptions.flatMap(item => {
    const entries = Object.entries(item.consumptions || {});
    return entries
      .filter(([, consumption]) => consumption)
      .map(([gradeId, consumption]) => {
        // Find the grade name from gradeItems
        const gradeItem = gradeItems.find(grade => grade.gradeId === Number(gradeId));
        const gradeName = gradeItem?.gradeName || '';
        
        return {
          id: item.id,
          speed: item.speed,
          mode: item.mode,
          gradeId: Number(gradeId),
          gradeName: gradeName,
          consumption: consumption,
          isDefault: item.isDefault || false,
        };
      });
  });
};

export const parseVesselGradesFromInitialData = (initialData: any): any[] => {
  let vesselGrades = initialData?.vesselGrades || initialData?.VesselGrades || [];
  
  // If vesselGrades is a JSON string, parse it
  if (typeof vesselGrades === 'string') {
    try {
      vesselGrades = JSON.parse(vesselGrades);
    } catch (e) {
      console.error('Failed to parse vesselGrades JSON:', e);
      vesselGrades = [];
    }
  }
  
  if (Array.isArray(vesselGrades)) {
    return vesselGrades.map((g: any) => ({
      id: Number(g?.id) || 0,
      vesselId: Number(g?.vesselId ?? initialData?.id) || 0,
      gradeId: Number(g?.gradeId ?? g?.GradeId) || 0,
      uomId: Number(g?.uomId ?? g?.UomId ?? 0),
      type: String(g?.type ?? g?.Type ?? 'primary'),
      gradeName: String(g?.gradeName ?? g?.GradeName ?? ''),
    }));
  }
  
  return [];
};

export const parseSpeedConsumptionsFromInitialData = (initialData: any): SpeedConsumptionItem[] => {
  let rawShipJson = initialData?.vesselJson;
  
  if (!rawShipJson) {
    return getDefaultSpeedConsumptions();
  }
  
  try {
    const parsed = typeof rawShipJson === 'string' ? JSON.parse(rawShipJson) : rawShipJson;
    const sc = parsed?.speedConsumptions;
    
    if (!Array.isArray(sc)) {
      return getDefaultSpeedConsumptions();
    }
    
    const grouped = new Map<string, SpeedConsumptionItem>();
    sc.forEach((row: any) => {
      const idNum = Number(row?.id) || 0;
      const speedStr = String(row?.speed ?? '');
      const modeStr = (row?.mode as 'ballast' | 'laden' | 'port') ?? 'ballast';
      const isDefault = Boolean(row?.isDefault) || false;
      const key = `${idNum}|${speedStr}|${modeStr}`;
      
      if (!grouped.has(key)) {
        grouped.set(key, {
          id: idNum,
          speed: speedStr,
          mode: modeStr,
          consumptions: {},
          isDefault: isDefault,
        });
      }
      
      const entry = grouped.get(key)!;
      const gid = Number(row?.gradeId) || 0;
      if (gid) {
        entry.consumptions[gid] = Number(row?.consumption ?? 0);
      }
    });

    let list = Array.from(grouped.values());
    
    // Ensure the default port row exists
    if (!list.some(item => item.id === 1 && item.mode === 'port')) {
      list = [{ id: 1, speed: '', mode: 'port', consumptions: {} }, ...list];
    }
    
    // Ensure at least one ballast and one laden record exists with proper defaults
    if (!list.some(item => item.mode === 'ballast')) {
      list.push({ 
        id: Math.max(...list.map(item => item.id), 0) + 1, 
        speed: '', 
        mode: 'ballast', 
        consumptions: {}, 
        isDefault: true 
      });
    } else {
      // If ballast records exist but none are default, make the first one default
      const ballastRecords = list.filter(item => item.mode === 'ballast');
      if (ballastRecords.length > 0 && !ballastRecords.some(item => item.isDefault)) {
        list = list.map(item => 
          item.id === ballastRecords[0].id ? { ...item, isDefault: true } : item
        );
      }
    }
    
    if (!list.some(item => item.mode === 'laden')) {
      list.push({ 
        id: Math.max(...list.map(item => item.id), 0) + 1, 
        speed: '', 
        mode: 'laden', 
        consumptions: {}, 
        isDefault: true 
      });
    } else {
      // If laden records exist but none are default, make the first one default
      const ladenRecords = list.filter(item => item.mode === 'laden');
      if (ladenRecords.length > 0 && !ladenRecords.some(item => item.isDefault)) {
        list = list.map(item => 
          item.id === ladenRecords[0].id ? { ...item, isDefault: true } : item
        );
      }
    }
    
    return list;
  } catch (e) {
    console.error('Failed to parse shipJson for speedConsumptions:', e);
    return getDefaultSpeedConsumptions();
  }
};

export const getDefaultSpeedConsumptions = (): SpeedConsumptionItem[] => {
  return [
    {
      id: 1,
      speed: '',
      mode: 'port',
      consumptions: {}
    },
    {
      id: 2,
      speed: '',
      mode: 'ballast',
      consumptions: {},
      isDefault: true
    },
    {
      id: 3,
      speed: '',
      mode: 'laden',
      consumptions: {},
      isDefault: true
    }
  ];
};

export const getDefaultGradeItem = (initialData: any): any => {
  return {
    id: 1,
    vesselId: Number(initialData?.id) || 0,
    gradeId: 0,
    uomId: 0,
    type: 'primary',
    gradeName: '',
  };
};
