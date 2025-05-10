import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {Tour} from '../../shared/model/tour';
import {MatChip, MatChipSet} from '@angular/material/chips';
import {DecimalPipe} from '@angular/common';
import {DatetimePipe} from '../../shared/pipe/datetime.pipe';
import {MatRipple} from '@angular/material/core';
import {TourMapComponent} from '../tour-map/tour-map.component';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faMedal} from '@fortawesome/free-solid-svg-icons';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		MatCard,
		MatCardHeader,
		MatCardFooter,
		MatCardTitle,
		MatChipSet,
		MatChip,
		DecimalPipe,
		MatCardContent,
		DatetimePipe,
		MatRipple,
		TourMapComponent,
		FaIconComponent,
	],
	selector: 'app-tour-card',
	styleUrl: './tour-card.component.scss',
	templateUrl: './tour-card.component.html',
})
export class TourCardComponent {
	faMedal = faMedal;

	tour = input.required<Tour>();

	numGold = computed(() => {
		return this.tour().segmentRecords.filter((record) => record.rankCreated == 1).length;
	});

	numSilver = computed(() => {
		return this.tour().segmentRecords.filter((record) => record.rankCreated == 2).length;
	});

	numBronze = computed(() => {
		return this.tour().segmentRecords.filter((record) => record.rankCreated == 3).length;
	});
}
