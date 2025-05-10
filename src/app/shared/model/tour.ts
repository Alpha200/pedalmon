import {SegmentRecord} from './segment-record';
import {TrackPoint} from './track-point';

export interface Tour {
	id: string;
	name: string;
	date: string;
	averageSpeedKmh: number;
	averageHeartRateBpm: number;
	distanceMeter: number;
	track: TrackPoint[];
	segmentRecords: SegmentRecord[];
}
