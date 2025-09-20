import { createApiClient } from '@commercialapp/ui/libs/api-client';
import { getApiUrl, API_CONFIG } from '@commercialapp/ui/config/api';
import { ApiModel } from './api-model-converter';

const estimateApi = createApiClient(getApiUrl(API_CONFIG.ENDPOINTS.ESTIMATES));
const thidpartyApi = createApiClient(getApiUrl(API_CONFIG.ENDPOINTS.THIDPARTY));

export const addOrUpdateEstimate = (data: ApiModel) => estimateApi.post('/AddOrUpdateEstimate', data);
export const getEstimates = () => estimateApi.get('/GetEstimates');
export const getlatestBunkerPrice = () => thidpartyApi.get('/GetLastestBunkerPrice');
export function getavgBunkrPrice() {
  return thidpartyApi.get('/GetAvgBunkerPrice');
}

export const getEstimateById = (id: number) => estimateApi.get(`/GetEstimateById/${id}`);
export const deleteEstimate = (id: number) => estimateApi.delete(`/DeleteEstimate/${id}`);
export const updateEstimateStatus = (id: number, status: string) => estimateApi.patch(`/UpdateEstimateStatus/${id}`, { status });
export const generateEstimate = (id: number) => estimateApi.get(`/GenerateVoyage/${id}`);