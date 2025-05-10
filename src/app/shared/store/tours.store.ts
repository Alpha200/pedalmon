import {patchState, signalStore, withMethods} from '@ngrx/signals';
import {upsertEntities, withEntities} from '@ngrx/signals/entities';
import {Tour} from '../model/tour';
import {setError, setFulfilled, setPending, withRequestStatus} from './request-status.feature';
import {inject} from '@angular/core';
import {ToursService} from '../service/tours.service';

export const ToursStore = signalStore(
	withEntities<Tour>(),
	withRequestStatus(),
	withMethods((state) => {
		const {entities} = state;
		const toursService = inject(ToursService);

		return {
			loadNext: async () => {
				patchState(state, setPending());
				const numEntities = entities().length;

				try {
					const tours = await toursService.getTours(numEntities);
					patchState(state, upsertEntities(tours.content));
					patchState(state, setFulfilled());
				} catch (e) {
					console.error('Failed to fetch tours.', e);
					patchState(state, setError('Failed to fetch tours.'));
				}
			}
		}
	})
)
