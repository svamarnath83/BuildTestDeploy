import { createApiClient } from '../../api-client';
import { getApiUrl, API_CONFIG } from '../../../config/api';
import { Port } from './models';

const portApi = createApiClient(getApiUrl(API_CONFIG.ENDPOINTS.PORTS));

export const getPort = () => portApi.get('/GetPorts');
export const addPort = (data: Port) => portApi.post('/AddOrUpdatePort', data);
export const deletePort = (id: number) => portApi.delete(`/DeletePort/${id}`);
export const getPortById = (id: number) => portApi.get(`/GetPortById/${id}`);
export const getCountry = () => portApi.get('/GetCountries');

  
  export const ETS_LIST = [
    "EU-ETS",
    "UK-ETS"
  ];