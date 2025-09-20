import { createApiClient } from '../../api-client';
import { getApiUrl, API_CONFIG } from '../../../config/api';
import { VesselType, CreateVesselTypeRequest, UpdateVesselTypeRequest } from './models';

const vesselTypeApi = createApiClient(getApiUrl(API_CONFIG.ENDPOINTS.VESSEL_TYPES));

export const getVesselType = () => vesselTypeApi.get('/GetVesselTypes');
export const addVesselType = (data: VesselType) => vesselTypeApi.post('/AddOrUpdateVesselType', data);
export const updateVesselType = (data: UpdateVesselTypeRequest) => vesselTypeApi.put(`/UpdateVesselType/${data.id}`, data);
export const deleteVesselType = (id: number) => vesselTypeApi.delete(`/DeleteVesselType/${id}`);
export const getVesselTypeById = (id: number) => vesselTypeApi.get(`/GetVesselTypeById/${id}`);

// New function to fetch vessel categories
export const getVesselCategories = () => vesselTypeApi.get('/GetVesselCategory');
