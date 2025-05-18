export interface LiveSegmentResult {
	status: 'inactive' | 'tracking' | 'finished' | 'failed',
	liveSegmentProgress?: {
		segmentId: string,
		timeElapsedSeconds: number,
		distanceMeters: number,
		distanceMetersBest: number,
		distanceMetersTotal: number,
	},
	liveSegmentResult?: LiveSegmentFinishResults,
}

export interface LiveSegmentFinishResults {
	timeElapsedTotalSeconds: number,
	timeElapsedBestSeconds: number,
	personalRank: number,
}
