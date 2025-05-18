import {ChangeDetectionStrategy, Component, computed, effect, inject, input, signal} from '@angular/core';
import {LiveSegmentFinishResults, LiveSegmentResult} from '../../shared/model/live-segment-result';
import {MatProgressBar} from '@angular/material/progress-bar';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faCrown, faPersonBiking} from '@fortawesome/free-solid-svg-icons';
import {SegmentsStore} from '../../shared/store/segments.store';
import {FormatSecondsPipe} from '../../shared/pipe/format-seconds.pipe';

@Component({
	selector: 'app-live-segment-details',
	imports: [
		MatProgressBar,
		FaIconComponent,
		FormatSecondsPipe,
	],
	templateUrl: './live-segment-details.component.html',
	styleUrl: './live-segment-details.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveSegmentDetailsComponent {
	protected readonly faCrown = faCrown;
	protected readonly faPersonBiking = faPersonBiking;

	readonly segmentsStore = inject(SegmentsStore);
	readonly liveSegment = input.required<LiveSegmentResult | null>();
	readonly finishResult = signal<LiveSegmentFinishResults | null>(null);
	readonly segmentName = computed(() => {
		const entityMap = this.segmentsStore.entityMap();
		const segmentId = this.liveSegment()?.liveSegmentProgress?.segmentId;

		if (segmentId == null) {
			return "";
		}

		const segment = entityMap[segmentId];

		if (segment == null) {
			return "";
		}

		return segment.name;
	});

	constructor() {
		effect(() => {
			const liveSegment = this.liveSegment();

			if (liveSegment?.status === 'finished') {
				this.finishResult.set(liveSegment.liveSegmentResult ?? null);
				setTimeout(() => {
					this.finishResult.set(null);
				}, 10000);
			}
		});
	}
}
