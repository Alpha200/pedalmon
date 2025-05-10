import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {TourCardComponent} from '../tour-card/tour-card.component';
import {Tour} from '../../shared/model/tour';
import {RouterLink} from '@angular/router';

@Component({
	selector: 'app-tour-list',
	imports: [
		TourCardComponent,
		RouterLink,
	],
	templateUrl: './tour-list.component.html',
	styleUrl: './tour-list.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourListComponent {
	readonly tours = input.required<Tour[]>();
}
