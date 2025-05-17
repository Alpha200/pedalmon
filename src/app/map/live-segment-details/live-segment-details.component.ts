import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {LiveSegmentResult} from '../../shared/model/live-segment-result';
import {MatProgressBar} from '@angular/material/progress-bar';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faCrown, faPersonBiking} from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-live-segment-details',
	imports: [
		MatProgressBar,
		FaIconComponent,
	],
	templateUrl: './live-segment-details.component.html',
	styleUrl: './live-segment-details.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveSegmentDetailsComponent {
	readonly liveSegment = input.required<LiveSegmentResult | null>();
	readonly secondsFormatted = computed(() => {
		const seconds = this.liveSegment()?.liveSegmentProgress?.timeElapsedSeconds;

		if (seconds != null) {
			return String(seconds % 60).padStart(2, '0');
		} else {
			return null;
		}
	});

	readonly minutesFormatted = computed(() => {
		const seconds = this.liveSegment()?.liveSegmentProgress?.timeElapsedSeconds;

		if (seconds != null) {
			return String(Math.floor(seconds / 60)).padStart(2, '0');
		} else {
			return null;
		}
	});
	protected readonly faCrown = faCrown;
	protected readonly faPersonBiking = faPersonBiking;
}
