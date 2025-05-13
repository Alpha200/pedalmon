import {ChangeDetectionStrategy, Component, inject, signal, viewChild} from '@angular/core';
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
import {MatCard} from '@angular/material/card';
import {ToursStore} from '../../shared/store/tours.store';
import { TrackPoint } from '../../shared/model/track-point';
import {calculateBearing, haversineDistance} from '../../shared/utils/geoutils';

@Component({
	selector: 'app-live-map',
	imports: [
		MapComponent,
		ControlComponent,
		GeolocateControlDirective,
		LayerComponent,
		GeoJSONSourceComponent,
		MatCard,
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
	readonly mapCenter = signal<[number, number]>([7, 51]);
	readonly liveMap = viewChild.required(MapComponent);
	readonly hoveredLayer = signal<string | null>(null);
	readonly mapBearing = signal<number>(0);
	private readonly lastBearings: number[] = [];
	private lastPosition?: [number, number];

	public readonly segmentsStore = inject(SegmentsStore);
	private readonly segmentsService = inject(SegmentsService);
	//public readonly toursStore = inject(ToursStore);
	//private readonly toursService = inject(ToursService);

	protected geolocated($event: Position) {
		const currentPosition: [number, number] = [$event.coords.longitude, $event.coords.latitude];

		if (this.lastPosition != null) {
			const distanceMeters = haversineDistance(
				currentPosition[1],
				currentPosition[0],
				this.lastPosition[1],
				this.lastPosition[0]
			) * 1000;

			if (distanceMeters < 5) {
				return;
			}

			const bearing = calculateBearing(this.lastPosition, currentPosition);

			if (this.lastBearings.length >= 4) {
				this.lastBearings.shift();
			}

			this.lastBearings.push(bearing);

			const newBearing = this.lastBearings.reduce((a,b) => (a + b) / 2);
			console.log("Bearing: ", newBearing);
			this.liveMap().mapInstance.easeTo({
				bearing: newBearing,
				center: currentPosition,
				animate: true,
				duration: 2000,
			});
		}

		this.lastPosition = currentPosition;
	}

	protected async moveEnded() {
		const bounds = this.liveMap().mapInstance.getBounds()!!;
		const [segmentIds] = await Promise.all([
			this.segmentsService.getSegmentsByBounds(bounds.getWest(), bounds.getNorth(), bounds.getEast(), bounds.getSouth()),
			//this.toursService.getToursByBounds(bounds.getWest(), bounds.getNorth(), bounds.getEast(), bounds.getSouth()),
		]);

		if (segmentIds.length > 0) {
			await this.segmentsStore.loadSegments(segmentIds);
		}

		//if (tourIds.length > 0) {
		//	await this.toursStore.loadTours(tourIds);
		//}
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

	public getTourCoordinates(track: TrackPoint[]): [number, number][] {
		return track.map((trackPoint) => [trackPoint.lon, trackPoint.lat]);
	}

	public getPaintForSegmentLayer(id: string) {
		const lineColor = id === this.hoveredLayer() ? '#c164ba' : '#ec7ae3';
		return {
			'line-color': lineColor,
			'line-width': 5,
		}
	}

	/*public getPaintForTourLayer(id: string) {
		const lineColor = id === this.hoveredLayer() ? '#c18064' : '#eca27a';
		return {
			'line-color': lineColor,
			'line-width': 5,
		}
	}*/

	async gotoSegmentDetails(id: string) {
		await this.router.navigateByUrl(`/segments/${id}`);
	}

	//async gotoTourDetails(id: string) {
	//	await this.router.navigateByUrl(`/tours/${id}`);
	//}
}
