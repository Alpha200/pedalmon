import {patchState, signalStore, withMethods} from '@ngrx/signals';
import {setAllEntities, upsertEntities, withEntities} from '@ngrx/signals/entities';
import {Tour} from '../model/tour';
import {setError, setFulfilled, setPending, withRequestStatus} from './request-status.feature';
import {inject} from '@angular/core';
import {ToursService} from '../service/tours.service';

export const ToursStore = signalStore(
	withEntities<Tour>(),
	withRequestStatus(),
	withMethods((state) => {
		const {entities, ids} = state;
		const toursService = inject(ToursService);

		return {
			loadNext: async () => {
				patchState(state, setPending());
				const numEntities = entities().length;

				try {
					const tours = await toursService.getTours({skip: numEntities});
					patchState(state, upsertEntities(tours.content));
					patchState(state, setFulfilled());
				} catch (e) {
					console.error('Failed to fetch tours.', e);
					patchState(state, setError('Failed to fetch tours.'));
				}
			},
			loadTours: async (newIds: string[]) => {
				const idSet = new Set(newIds);
				const alreadyLoadedIds = new Set(ids());

				const missingIds: Set<string> = idSet.difference(alreadyLoadedIds);

				if (missingIds.size > 0) {
					try {
						const tours = await toursService.getTours({tourIds: Array.from(missingIds)});
						patchState(state, setAllEntities(tours.content));
					} catch (e) {
						console.error('Failed to fetch segments.', e);
					}
				}
			}
		}
	})
)
