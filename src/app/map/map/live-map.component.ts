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
	mapCenter = signal<[number, number]>([7, 51]);
	liveMap = viewChild.required(MapComponent);

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

	public segmentHoverStart($event: any) {
		console.log('Hover start', $event);
	}

	public segmentHoverEnd($event: any) {
		console.log('Hover end', $event);
	}
}
