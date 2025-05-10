import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ToursService} from '../../shared/service/tours.service';
import {Tour} from '../../shared/model/tour';
import {filter, Observable, switchMap} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {TourDetailsViewComponent} from '../tour-details-view/tour-details-view.component';

@Component({
	selector: 'app-tour-details',
	imports: [
		AsyncPipe,
		TourDetailsViewComponent,
	],
	templateUrl: './tour-details.component.html',
	styleUrl: './tour-details.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourDetailsComponent {
	public tour: Observable<Tour>;

	constructor(
		toursService: ToursService,
		activeRoute: ActivatedRoute,
	) {
		this.tour = activeRoute.params.pipe(
			filter((params) => params?.['id'] != null),
			switchMap((params) => toursService.getTour(params['id'])),
		)
	}
}
