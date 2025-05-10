import {Segment} from './segment';
import {Tour} from './tour';

export interface SegmentRecord {
	rankCreated?: number;
	id: string;
	tour?: Tour;
	segment: Segment;
	speedKmh: number;
	durationS: number;
	time: string;
}
