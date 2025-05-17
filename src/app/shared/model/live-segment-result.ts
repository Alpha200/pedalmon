export interface LiveSegmentResult {
	status: 'inactive' | 'tracking' | 'finished' | 'failed',
	liveSegmentProgress?: {
		segmentId: string,
		timeElapsedSeconds: number,
		distanceMeters: number,
		distanceMetersBest: number,
		distanceMetersTotal: number,
	},
	liveSegmentResult?: {
		timeElapsedTotalSeconds: number,
		timeElapsedBestSeconds: number,
		personalRank: number,
	},
}
