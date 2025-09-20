import { createApiClient } from '../api-client'
import { getApiUrl, API_CONFIG } from '../../config/api'
import { ActivityModel, ActivityResponse } from './models'

const activityApi = createApiClient(getApiUrl(API_CONFIG.ENDPOINTS.ACTIVITY))

export const addOrUpdateActivity = (data: ActivityModel) => activityApi.post<ActivityResponse>('/AddOrUpdate', data)
export const updateActivityStatus = (id: number, data: Partial<ActivityModel> & { moduleId: number; recordId: number }) => {
  return activityApi.post<ActivityResponse>('/AddOrUpdate', { id, ...data })
}
export const getActivitiesByRecord = (moduleId: number, recordId: number) => activityApi.get<ActivityResponse[]>(`/GetByRecord/${moduleId}/${recordId}`)
export const getActivityById = (id: number) => activityApi.get<ActivityResponse>(`/GetActivityById/${id}`)
export const deleteActivity = (id: number) => activityApi.delete(`/DeleteActivity/${id}`)

export const ActivityService = {
  addOrUpdateActivity,
  updateActivityStatus,
  getActivitiesByRecord,
  getActivityById,
  deleteActivity,
}

export default ActivityService


