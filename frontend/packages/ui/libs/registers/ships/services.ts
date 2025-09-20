import { createApiClient } from '../../api-client';
import { getApiUrl, API_CONFIG } from '../../../config/api';
import { Vessel } from './models';

const shipApi = createApiClient(getApiUrl(API_CONFIG.ENDPOINTS.SHIPS));

export const getShips = (includeBunker: boolean = false) =>
  shipApi.get(`/GetVessels?includeBunker=${includeBunker}`);
export const addShip = (data: Vessel) => shipApi.post('/AddOrUpdateVessel', data);
export const deleteShip = (id: number) => shipApi.delete(`/DeleteVessel/${id}`);
export const getShipById = (id: number) => shipApi.get(`/GetVesselById/${id}`);
export const validateVesselCode = (code: string, excludeId?: number) => {
  const params = new URLSearchParams();
  params.append('code', code);
  if (excludeId) {
    params.append('excludeId', excludeId.toString());
  }
  return shipApi.get(`/ValidateVesselCode?${params.toString()}`);
};

// Legacy service wrapper for backward compatibility
class ShipService {
  async getShips(includeBunker: boolean = false) {
    const response = await getShips(includeBunker);
    return { ships: response.data };
  }

  async deleteShip(id: number) {
    await deleteShip(id);
    return true;
  }

  async createShip(data: any) {
    const response = await addShip(data);
    return response.data;
  }

  async updateShip(id: number, data: any) {
    const response = await addShip({ ...data, id });
    return response.data;
  }
}

export const shipService = new ShipService(); 