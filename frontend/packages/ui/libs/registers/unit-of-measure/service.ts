import { createApiClient } from '../../api-client';
import { getApiUrl, API_CONFIG } from '../../../config/api';

const unitOfMeasureApi = createApiClient(getApiUrl(API_CONFIG.ENDPOINTS.UNITS));

export const getUnitOfMeasure = () => unitOfMeasureApi.get('/GetUnitsOfMeasure'); 