import { createApiClient } from '../../api-client';
import { getApiUrl, API_CONFIG } from '../../../config/api';

const areaApi = createApiClient(getApiUrl(API_CONFIG.ENDPOINTS.AREAS));

export const getArea = () => areaApi.get('/GetAreas');
  
