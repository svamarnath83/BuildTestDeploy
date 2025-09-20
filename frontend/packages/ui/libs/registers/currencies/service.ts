import { createApiClient } from '../../api-client';
import { getApiUrl, API_CONFIG } from '../../../config/api';

const currencyApi = createApiClient(getApiUrl(API_CONFIG.ENDPOINTS.CURRENCIES));

export const getCurrency = () => currencyApi.get('/GetCurrencyTypes'); 