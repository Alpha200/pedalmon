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

	public async getTours(skip: number): Promise<Page<Tour>> {
		const params = new HttpParams()
			.set('page', Math.floor(skip / ToursService.PAGE_SIZE))
			.set('size', ToursService.PAGE_SIZE);

		return firstValueFrom(this.http.get<Page<Tour>>(`${this.baseUrl}/tours`, {params}));
	}

	public getTour(id: string): Observable<Tour> {
		return this.http.get<Tour>(`${this.baseUrl}/tours/${id}`)
	}
}
