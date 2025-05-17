import {ChangeDetectionStrategy, Component, computed, inject, signal, viewChild} from '@angular/core';
import {SegmentsService} from '../../shared/service/segments.service';
import {SegmentsStore} from '../../shared/store/segments.store';
import {
	ControlComponent, GeoJSONSourceComponent,
	GeolocateControlDirective,
	LayerComponent,
	MapComponent,
	Position,
} from '@maplibre/ngx-maplibre-gl';
import {Router} from '@angular/router';
import {ToursStore} from '../../shared/store/tours.store';
import {calculateBearing, haversineDistance} from '../../shared/utils/geoutils';
import {LiveSegmentsService} from '../../shared/service/live-segments.service';
import {DateTime} from 'luxon';
import {LiveSegmentResult} from '../../shared/model/live-segment-result';
import {LiveSegmentDetailsComponent} from '../live-segment-details/live-segment-details.component';

@Component({
	selector: 'app-live-map',
	imports: [
		MapComponent,
		ControlComponent,
		GeolocateControlDirective,
		LayerComponent,
		GeoJSONSourceComponent,
		LiveSegmentDetailsComponent,
	],
	templateUrl: './live-map.component.html',
	styleUrl: './live-map.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		SegmentsStore,
		ToursStore,
	]
})
export class LiveMapComponent {
	readonly router = inject(Router);
	readonly liveMap = viewChild.required(MapComponent);
	readonly hoveredLayer = signal<string | null>(null);
	readonly liveSegmentResult = signal<LiveSegmentResult | null>(null)
	readonly activeSegmentId = computed(() => {
		const liveSegmentResult = this.liveSegmentResult();
		return liveSegmentResult?.liveSegmentProgress?.segmentId;
	});

	private readonly lastBearings: number[] = [];
	private lastPosition?: [number, number];

	public readonly segmentsStore = inject(SegmentsStore);
	private readonly segmentsService = inject(SegmentsService);
	private readonly liveSegmentService = inject(LiveSegmentsService);

	protected geolocated($event: Position) {
		this.updateMapWithCurrentPosition($event);
		this.updateLiveSegment($event.coords, $event.timestamp).then();
	}

	protected async moveEnded() {
		const bounds = this.liveMap().mapInstance.getBounds();
		const segmentIds = await this.segmentsService.getSegmentsByBounds(
			bounds.getWest(), bounds.getNorth(), bounds.getEast(), bounds.getSouth()
		);

		if (segmentIds.length > 0) {
			await this.segmentsStore.loadSegments(segmentIds);
		}
	}

	public layerHoverStart(id: string) {
		this.hoveredLayer.set(id);
	}

	public layerHoverEnd(id: string) {
		this.hoveredLayer.update((value) => {
			if (value === id) {
				return null;
			} else {
				return value;
			}
		});
	}

	public getPaintForSegmentLayer(id: string) {
		return {
			'line-color': this.getSegmentColor(id),
			'line-width': 5,
		}
	}

	async gotoSegmentDetails(id: string) {
		await this.router.navigateByUrl(`/segments/${id}`);
	}

	private async updateLiveSegment(coords: any, timestamp: number) {
		//this.liveSegmentResult.set({
		//	status: 'tracking',
		//	liveSegmentProgress: {
		//		segmentId: 'blubb',
		//		distanceMeters: 100,
		//		distanceMetersBest: 150,
		//		timeElapsedSeconds: 10,
		//		distanceMetersTotal: 500,
		//	}
		//});
		this.liveSegmentResult.set(await this.liveSegmentService.submitCurrentPosition(
			[coords.longitude, coords.latitude],
			DateTime.fromMillis(timestamp).toISO()!!
		));
	}

	private getSegmentColor(id: string) {
		if (this.activeSegmentId() === id) {
			return '#ec7a7a';
		} else if (id === this.hoveredLayer()) {
			return '#c164ba';
		} else {
			return '#ec7ae3';
		}
	}

	private updateMapWithCurrentPosition($event: Position) {
		const currentPosition: [number, number] = [$event.coords.longitude, $event.coords.latitude];

		if (this.lastPosition != null) {
			const distanceMeters = haversineDistance(
				currentPosition[1],
				currentPosition[0],
				this.lastPosition[1],
				this.lastPosition[0],
			) * 1000;

			if (distanceMeters < 5) {
				return;
			}

			const bearing = calculateBearing(this.lastPosition, currentPosition);

			if (this.lastBearings.length >= 4) {
				this.lastBearings.shift();
			}

			this.lastBearings.push(bearing);

			const newBearing = this.lastBearings.reduce((a, b) => (a + b) / 2);

			this.liveMap().mapInstance.easeTo({
				bearing: newBearing,
				center: currentPosition,
				animate: true,
				duration: 2000,
			});
		}

		this.lastPosition = currentPosition;
	}
}
