import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	model,
	OnInit,
	signal,
	Signal,
} from '@angular/core';
import {
	ControlComponent,
	GeoJSONSourceComponent,
	LayerComponent,
	MapComponent,
	NavigationControlDirective,
} from '@maplibre/ngx-maplibre-gl';
import {filter, switchMap} from 'rxjs';
import {Tour} from '../../shared/model/tour';
import {ToursService} from '../../shared/service/tours.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSlider, MatSliderRangeThumb} from '@angular/material/slider';
import {toSignal} from '@angular/core/rxjs-interop';
import {LngLatBounds, LngLatBoundsLike} from 'maplibre-gl';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {SegmentsService} from '../../shared/service/segments.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CreateSegment} from '../../shared/model/create-segment';

@Component({
	selector: 'app-create-segment',
	imports: [
		LayerComponent,
		MapComponent,
		MatSlider,
		MatSliderRangeThumb,
		GeoJSONSourceComponent,
		ControlComponent,
		NavigationControlDirective,
		MatButton,
		MatFormField,
		MatLabel,
		MatInput,
		FormsModule,
		MatLabel,
		MatFormField,
	],
	templateUrl: './create-segment.component.html',
	styleUrl: './create-segment.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateSegmentComponent implements OnInit {
	public tour: Signal<Tour | undefined>;
	public tourCoordinates: Signal<[number, number][] | undefined>;
	public segmentCoordinates: Signal<[number, number][]>;
	public segmentMin = signal(0);
	public segmentMax = signal(0);
	public segmentName = model("");
	public segmentSource: Signal<GeoJSON.LineString>;
	public segmentStartSource: Signal<GeoJSON.Point | undefined>;
	public segmentEndSource: Signal<GeoJSON.Point | undefined>;
	public bounds: Signal<LngLatBoundsLike>;
	public initSliders = signal(false);

	constructor(
		toursService: ToursService,
		activeRoute: ActivatedRoute,
		private readonly segmentsService: SegmentsService,
		private readonly router: Router,
		private readonly snackBar: MatSnackBar,
	) {
		this.tour = toSignal(activeRoute.params.pipe(
			filter((params) => params?.['id'] != null),
			switchMap((params) => toursService.getTour(params['id'])),
		));

		this.tourCoordinates = computed(() => {
			return this.tour()?.track?.map((trackPoint) => [trackPoint.lon, trackPoint.lat]);
		});

		this.segmentCoordinates = computed(() => {
			const tourCoordinates = this.tourCoordinates();
			const segmentMin = this.segmentMin();
			const segmentMax = this.segmentMax();

			if (tourCoordinates == null || segmentMin == null || segmentMax == null) {
				return [];
			} else {
				return tourCoordinates.slice(segmentMin, segmentMax);
			}
		});

		this.segmentSource = computed(() => {
			return {
				type: 'LineString',
				coordinates: this.segmentCoordinates() ?? [],
			}
		});

		this.segmentStartSource = computed(() => {
			const coordinates = this.segmentCoordinates();
			if (coordinates.length > 0) {

				return {
					type: 'Point',
					coordinates: coordinates[0],
				}
			} else {
				return undefined;
			}
		});

		this.segmentEndSource = computed(() => {
			const coordinates = this.segmentCoordinates();
			if (coordinates.length > 1) {

				return {
					type: 'Point',
					coordinates: coordinates[coordinates.length - 1],
				}
			} else {
				return undefined;
			}
		});

		this.bounds = computed(() => {
			const coordinates = this.tourCoordinates() ?? [];

			if (coordinates.length === 0) {
				return [[0,0], [0,0]];
			}

			const bounds = new LngLatBounds();

			coordinates.forEach((coordinate) => {
				bounds.extend(coordinate);
			});

			return bounds;
		});

		effect(() => {
			const tourCoordinates = this.tourCoordinates();

			if (this.initSliders() && tourCoordinates != null) {
				this.initSliders.set(false);
				this.segmentMax.set(tourCoordinates.length - 1);
			}
		});
	}

	ngOnInit(): void {
		this.initSliders.set(true);
	}

	onSliderChange($event: Event) {
		const inputElement = $event.target as HTMLInputElement;

		if (inputElement.id == "segmentSliderMin") {
			this.segmentMin.set(parseInt(inputElement.value));
		} else {
			this.segmentMax.set(parseInt(inputElement.value));
		}
	}

	public async createSegment() {
		const segment: CreateSegment = {
			name: this.segmentName(),
			path: this.segmentCoordinates()
		};

		try {
			await this.segmentsService.createSegment(segment);
		} catch (error) {
			this.snackBar.open("Failed to create segment: Unknown error");
			console.error(error);
		}

		await this.router.navigate(['']);
	}
}
