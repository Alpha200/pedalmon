import {Pipe, PipeTransform} from '@angular/core';

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

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
	const toRadians = (degrees: number) => degrees * (Math.PI / 180);

	const R = 6371; // Earth's radius in kilometers
	const dLat = toRadians(lat2 - lat1);
	const dLon = toRadians(lon2 - lon1);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return R * c; // Distance in kilometers
}
