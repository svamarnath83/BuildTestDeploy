import { createApiClient } from '../../api-client';
import { getApiUrl, API_CONFIG } from '../../../config/api';
import { Grade } from './models';

const gradeApi = createApiClient(getApiUrl(API_CONFIG.ENDPOINTS.GRADES));

export const getGrade = () => gradeApi.get('/GetGrades');
export const addGrade = (data: Grade) => gradeApi.post('/AddOrUpdateGrade', data);
export const deleteGrade = (id: number) => gradeApi.delete(`/DeleteGrade/${id}`);
export const getGradeById = (id: number) => gradeApi.get(`/GetGradeById/${id}`); 