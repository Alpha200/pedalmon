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

@Component({
	selector: 'app-live-map',
	imports: [
		MapComponent,
		ControlComponent,
		GeolocateControlDirective,
		LayerComponent,
		GeoJSONSourceComponent,
	],
	templateUrl: './live-map.component.html',
	styleUrl: './live-map.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		SegmentsStore,
	]
})
export class LiveMapComponent {
	readonly router = inject(Router);
	readonly mapCenter = signal<[number, number]>([7, 51]);
	readonly liveMap = viewChild.required(MapComponent);
	readonly hoveredSegment = signal<string | null>(null);

	public readonly segmentsStore = inject(SegmentsStore);
	private readonly segmentsService = inject(SegmentsService);

	protected geolocated($event: Position) {
		console.log("Geolocated", $event);
	}

	protected async moveEnded() {
		const bounds = this.liveMap().mapInstance.getBounds()!!;
		const result = await this.segmentsService.getSegmentsByBounds(bounds.getWest(), bounds.getNorth(), bounds.getEast(), bounds.getSouth());

		if (result.length > 0) {
			await this.segmentsStore.loadSegments(result);
		}
	}

	public segmentHoverStart(id: string) {
		this.hoveredSegment.set(id);
	}

	public segmentHoverEnd(id: string) {
		this.hoveredSegment.update((value) => {
			if (value === id) {
				return null;
			} else {
				return value;
			}
		});
	}

	getPaintForSegmentLayer(id: string) {
		const lineColor = id === this.hoveredSegment() ? '#c164ba' : '#ec7ae3';
		return {
			'line-color': lineColor,
			'line-width': 5,
		}

	}

	async gotoSegmentDetails(id: string) {
		await this.router.navigateByUrl(`/segments/${id}`);
	}
}
