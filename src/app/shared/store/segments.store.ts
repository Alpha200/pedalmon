import {patchState, signalStore, withMethods} from '@ngrx/signals';
import {upsertEntities, withEntities} from '@ngrx/signals/entities';
import {inject} from '@angular/core';
import {Segment} from '../model/segment';
import {SegmentsService} from '../service/segments.service';

export const SegmentsStore = signalStore(
	withEntities<Segment>(),
	withMethods((state) => {
		const {ids} = state;
		const segmentsService = inject(SegmentsService);

		return {
			loadSegments: async (newIds: string[]) => {
				const idSet = new Set(newIds);
				const alreadyLoadedIds = new Set(ids());

				const missingIds: Set<string> = idSet.difference(alreadyLoadedIds);

				if (missingIds.size > 0) {
					try {
						const segments = await segmentsService.getSegments(Array.from(missingIds));
						patchState(state, upsertEntities(segments.content));
					} catch (e) {
						console.error('Failed to fetch segments.', e);
					}
				}
			}
		}
	})
)
