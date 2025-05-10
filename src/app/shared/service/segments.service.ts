import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import {Page} from '../model/page';
import {Segment} from '../model/segment';
import {SegmentRecord} from '../model/segment-record';
import {environment} from '../../../environments/environment';
import {CreateSegment} from '../model/create-segment';

@Injectable({
	providedIn: 'root'
})
export class SegmentsService {

	constructor(
		private readonly http: HttpClient,
	) {
	}

	get baseUrl(): string {
		return environment.api.baseUrl;
	}

	public async getSegments(segmentIds?: string[]): Promise<Page<Segment>> {
		let params = new HttpParams();

		if (segmentIds != null) {
			params = params.set("filter.ids", segmentIds.join(','));
		}

		return firstValueFrom(this.http.get<Page<Segment>>(`${this.baseUrl}/segments`, {params}));
	}

	public getSegment(id: string): Observable<Segment> {
		return this.http.get<Segment>(`${this.baseUrl}/segments/${id}`);
	}

	public getSegmentRecordsBySegmentId(id: string): Observable<Page<SegmentRecord>> {
		return this.http.get<Page<SegmentRecord>>(`${this.baseUrl}/segments/${id}/records`);
	}

	public async createSegment(segment: CreateSegment): Promise<Segment> {
		return firstValueFrom(this.http.post<Segment>(`${this.baseUrl}/segments`, segment));
	}

	public async getSegmentsByBounds(xMin: number, yMin: number, xMax: number, yMax: number) {
		return firstValueFrom(this.http.get<string[]>(`${this.baseUrl}/segments/bounds/${xMin},${yMin},${xMax},${yMax}/ids`));
	}
}
