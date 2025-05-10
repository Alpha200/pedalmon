import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {filter, Observable, switchMap, tap} from 'rxjs';
import {Segment} from '../../shared/model/segment';
import {SegmentsService} from '../../shared/service/segments.service';
import {ActivatedRoute} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {SegmentDetailsViewComponent} from '../segment-details-view/segment-details-view.component';
import {LoadingSpinnerComponent} from '../../shared/component/loading-spinner/loading-spinner.component';

@Component({
	selector: 'app-segment-details',
	imports: [
		AsyncPipe,
		SegmentDetailsViewComponent,
		LoadingSpinnerComponent,
	],
	templateUrl: './segment-details.component.html',
	styleUrl: './segment-details.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SegmentDetailsComponent {
	public segment: Observable<Segment>;
	public loading = signal<boolean>(true);

	constructor(
		segmentsService: SegmentsService,
		activeRoute: ActivatedRoute,
	) {
		this.segment = activeRoute.params.pipe(
			filter((params) => params?.['id'] != null),
			switchMap((params) => segmentsService.getSegment(params['id'])),
			tap(() => {
				this.loading.set(false);
			})
		)
	}
}
