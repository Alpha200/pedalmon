import {Pipe, PipeTransform} from '@angular/core';
import {haversineDistance} from '../utils/geoutils';

@Pipe({
	name: 'distance',
})
export class DistancePipe implements PipeTransform {

	transform(value: [number, number][]): number {
		let dist = 0;

		for (let i = 1; i < value.length; i++) {
			dist += haversineDistance(value[i - 1][0], value[i - 1][1], value[i][0], value[i][1]);
		}

		return dist;
	}

}

