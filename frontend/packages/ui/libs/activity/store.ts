import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { ActivityResponse } from './models'
import { useCacheStore } from '../cache'

interface ActivityCacheKey {
	moduleId: number
	recordId: number
}

interface ActivityStateItem {
	key: string
	items: ActivityResponse[]
	lastFetchedAt: number
}

interface ActivityStoreState {
	itemsByKey: Record<string, ActivityStateItem>
	setItems: (key: ActivityCacheKey, items: ActivityResponse[]) => void
	getItems: (key: ActivityCacheKey) => ActivityResponse[] | undefined
	clear: () => void
}

const makeKey = (key: ActivityCacheKey, userId?: string | null) => {
	const safeUser = userId || 'anonymous'
	return `${safeUser}:${key.moduleId}:${key.recordId}`
}

export const useActivityStore = create<ActivityStoreState>()(
	persist(
		(set, get) => ({
			itemsByKey: {},
			setItems: (key, items) => {
				const userId = useCacheStore.getState().activeSession?.id || null
				const cacheKey = makeKey(key, userId)
				set((state) => ({
					itemsByKey: {
						...state.itemsByKey,
						[cacheKey]: {
							key: cacheKey,
							items,
							lastFetchedAt: Date.now(),
						},
					},
				}))
			},
			getItems: (key) => {
				const userId = useCacheStore.getState().activeSession?.id || null
				const cacheKey = makeKey(key, userId)
				return get().itemsByKey[cacheKey]?.items
			},
			clear: () => set({ itemsByKey: {} }),
		}),
		{
			name: 'activity-store',
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({ itemsByKey: state.itemsByKey }),
		}
	)
)


