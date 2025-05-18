import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {Segment} from '../../shared/model/segment';
import {distinctUntilChanged, switchMap} from 'rxjs';
import {AsyncPipe, DecimalPipe} from '@angular/common';
import {DistancePipe} from '../../shared/pipe/distance.pipe';
import {DurationPipe} from '../../shared/pipe/duration.pipe';
import {SegmentsService} from '../../shared/service/segments.service';
import {DatetimePipe} from '../../shared/pipe/datetime.pipe';
import {toObservable} from '@angular/core/rxjs-interop';
import {GeoJSONSourceComponent, LayerComponent, MapComponent} from '@maplibre/ngx-maplibre-gl';
import {LngLatBounds} from 'maplibre-gl';

@Component({
	selector: 'app-segment-details-view',
	imports: [
		MapComponent,
		LayerComponent,
		DecimalPipe,
		DistancePipe,
		DurationPipe,
		AsyncPipe,
		DatetimePipe,
		GeoJSONSourceComponent,
	],
	templateUrl: './segment-details-view.component.html',
	styleUrl: './segment-details-view.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SegmentDetailsViewComponent {
	private readonly segmentsService = inject(SegmentsService);

	segment = input.required<Segment>()
	bounds = computed(() => {
		const bounds = new LngLatBounds();

		this.segment().path.forEach((coordinate) => {
			bounds.extend(coordinate);
		});

		return bounds;
	});
	segmentRecords = toObservable(this.segment).pipe(
		distinctUntilChanged(() => false, (segment) => segment.id),
		switchMap((segment) => {
			return this.segmentsService.getSegmentRecordsBySegmentId(segment.id!!)
		})
	);
}
