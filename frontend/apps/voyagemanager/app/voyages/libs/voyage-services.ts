import { createApiClient } from '@commercialapp/ui';
import { getApiUrl, API_CONFIG } from '@commercialapp/ui';
import type { 
  Voyage, 
  VoyagePortCall, 
  CreateVoyageRequest, 
  UpdateVoyageStatusRequest, 
  UpdatePortCallActualsRequest 
} from './voyage-models';
import type { VesselOverviewDto, VoyageOverviewDto } from './vessel-detail-model';


const voyageApi = createApiClient(getApiUrl(API_CONFIG.ENDPOINTS.VOYAGES));

export const getVoyages = () => 
  voyageApi.get('/GetVoyages', { 
    headers: { 'Content-Type': 'application/json' } 
  });

export const getVesselOverview = (id: number) =>
  voyageApi.get(`/VesselOverview/${id}`, {
    headers: { 'Content-Type': 'application/json' }
  });

export const getVoyageById = async (id: number) => 
  voyageApi.get(`/GetVoyageById/${id}`, {
    headers: { 'Content-Type': 'application/json' }
  });


export const createVoyage = (voyage: CreateVoyageRequest) =>
  voyageApi.post('/CreateVoyage', voyage, {
    headers: { 'Content-Type': 'application/json' }
  });

export const createVoyageFromEstimate = (estimateId: number, options: { notes?: string }) =>
  voyageApi.post(`/CreateVoyageFromEstimate/${estimateId}`, options, {
    headers: { 'Content-Type': 'application/json' }
  });

export const updateVoyage = (id: number, voyage: Partial<Voyage>) =>
  voyageApi.put(`/UpdateVoyage/${id}`, voyage, {
    headers: { 'Content-Type': 'application/json' }
  });

export const updateVoyageStatus = (id: number, statusUpdate: UpdateVoyageStatusRequest) =>
  voyageApi.patch(`/UpdateVoyageStatus/${id}`, statusUpdate, {
    headers: { 'Content-Type': 'application/json' }
  });

export const deleteVoyage = (id: number) =>
  voyageApi.delete(`/DeleteVoyage/${id}`, {
    headers: { 'Content-Type': 'application/json' }
  });

export const getVoyagePortCalls = (voyageId: number) =>
  voyageApi.get(`/GetVoyagePortCalls/${voyageId}`, {
    headers: { 'Content-Type': 'application/json' }
  });

export const updatePortCallActuals = (portCallId: number, actuals: UpdatePortCallActualsRequest) =>
  voyageApi.patch(`/UpdatePortCallActuals/${portCallId}`, actuals, {
    headers: { 'Content-Type': 'application/json' }
  });

  export const GetVesselPositions = () =>
    voyageApi.get(`/VesselPositions`, {
    });