import {Component, computed, input} from '@angular/core';
import {
	AttributionControlDirective,
	ControlComponent,
	GeoJSONSourceComponent,
	LayerComponent,
	MapComponent,
} from '@maplibre/ngx-maplibre-gl';
import {Tour} from '../../shared/model/tour';
import {LngLatBounds} from 'maplibre-gl';

@Component({
  selector: 'app-tour-map',
	imports: [
		MapComponent,
		LayerComponent,
		GeoJSONSourceComponent,
	],
  templateUrl: './tour-map.component.html',
  styleUrl: './tour-map.component.scss'
})
export class TourMapComponent {
	public tour = input.required<Tour>();
	public trackCoordinates = computed(() => {
		return this.tour().track.map((p) => [p.lon, p.lat]);
	});
	public bounds = computed(() => {
		const bounds = new LngLatBounds();

		this.tour().track.forEach((coordinate) => {
			bounds.extend(coordinate);
		});

		// Set the bounds to fit the layer
		return bounds;
	});
}
