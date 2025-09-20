import { createApiClient } from '../../api-client';
import { getApiUrl, API_CONFIG } from '../../../config/api';
import { Commodity } from './models';

const commodityApi = createApiClient(getApiUrl(API_CONFIG.ENDPOINTS.COMMODITIES));

export const getCommodity = () => commodityApi.get('/GetCommodities');
export const addCommodity = (data: Commodity) => commodityApi.post('/AddOrUpdateCommodity', data);
export const deleteCommodity = (id: number) => commodityApi.delete(`/DeleteCommodity/${id}`);
export const getCommodityById = (id: number) => commodityApi.get(`/GetCommodityById/${id}`);
