import {Pipe, PipeTransform} from '@angular/core';
import {DateTime} from 'luxon';

@Pipe({
	name: 'datetime'
})
export class DatetimePipe implements PipeTransform {

	transform(value: string): string {
		const date = DateTime.fromISO(value);
		return `${date.toLocaleString({
			...DateTime.DATE_SHORT,
			day: '2-digit',
			month: '2-digit'
		})} ${date.toLocaleString(DateTime.TIME_SIMPLE)}`;
	}

}
