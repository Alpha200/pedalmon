import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'duration'
})
export class DurationPipe implements PipeTransform {

	transform(value: number): string {
		const seconds = Math.floor(value % 60);
		return `${Math.floor(value / 60)}:${seconds < 10 ? '0' : ''}${seconds}`;
	}

}
