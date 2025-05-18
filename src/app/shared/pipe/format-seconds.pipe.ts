import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'formatSeconds'
})
export class FormatSecondsPipe implements PipeTransform {
	transform(value: number | undefined | null): string {
		if (value == null) {
			return '';
		}

		const minutes = Math.floor(value / 60);
		const seconds = value % 60;
		const secondsPadded = String(seconds).padStart(2, '0');
		return `${minutes}:${secondsPadded}`;
	}
}
