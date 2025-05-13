import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import {Page} from '../model/page'
import {Tour} from '../model/tour';
import {environment} from '../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ToursService {
	private static readonly PAGE_SIZE = 5;

	constructor(
		private readonly http: HttpClient,
	) {
	}

	get baseUrl(): string {
		return environment.api.baseUrl;
	}

	public async getTours(options: {skip?: number, tourIds?: string[]}): Promise<Page<Tour>> {
		let params = new HttpParams();

		if (options.tourIds != null) {
			params = params.set("filter.ids", options.tourIds.join(','));
		}

		if (options.skip != null) {
			params.set('page', Math.floor(options.skip / ToursService.PAGE_SIZE))
			params.set('size', ToursService.PAGE_SIZE);
		}

		return firstValueFrom(this.http.get<Page<Tour>>(`${this.baseUrl}/tours`, {params}));
	}

	public getTour(id: string): Observable<Tour> {
		return this.http.get<Tour>(`${this.baseUrl}/tours/${id}`)
	}

	public async addTourTxc(fileContents: string) {
		return firstValueFrom(this.http.post<Tour>(`${this.baseUrl}/tours/import/tcx`, fileContents, {
			headers: {
				'Content-Type': 'application/xml'
			}
		}));
	}

	public async addTourGpx(fileContents: string) {
		return firstValueFrom(this.http.post<Tour>(`${this.baseUrl}/tours/import/gpx`, fileContents, {
			headers: {
				'Content-Type': 'application/xml'
			}
		}));
	}

	public async getToursByBounds(xMin: number, yMin: number, xMax: number, yMax: number) {
		return firstValueFrom(this.http.get<string[]>(`${this.baseUrl}/tours/bounds/${xMin},${yMin},${xMax},${yMax}/ids`));
	}
}
