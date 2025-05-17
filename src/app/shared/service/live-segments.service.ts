import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {environment} from '../../../environments/environment';
import {LiveSegmentResult} from '../model/live-segment-result';

@Injectable({
	providedIn: 'root'
})
export class LiveSegmentsService {

	constructor(
		private readonly http: HttpClient,
	) {
	}

	get baseUrl(): string {
		return environment.api.baseUrl;
	}

	public submitCurrentPosition(currentPosition: [number, number], timeTracked: string): Promise<LiveSegmentResult> {
		return firstValueFrom(this.http.post<LiveSegmentResult>(`${environment.api.baseUrl}/live-segments/position`, {
			position: {
				x: currentPosition[0],
				y: currentPosition[1],
			},
			date: timeTracked,
		}));
	}
}
