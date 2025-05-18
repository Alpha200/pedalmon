import {ChangeDetectionStrategy, Component, computed, inject, input, Signal} from '@angular/core';
import {Tour} from '../../shared/model/tour';
import {DecimalPipe} from '@angular/common';
import {MatActionList, MatListItem, MatListItemLine, MatListItemTitle} from '@angular/material/list';
import {DistancePipe} from '../../shared/pipe/distance.pipe';
import {DurationPipe} from '../../shared/pipe/duration.pipe';
import {RouterLink} from '@angular/router';
import {TourMapComponent} from '../tour-map/tour-map.component';
import {DatetimePipe} from '../../shared/pipe/datetime.pipe';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faMedal} from '@fortawesome/free-solid-svg-icons';
import {MatButton} from '@angular/material/button';
import {NgxEchartsDirective, provideEchartsCore} from 'ngx-echarts';
import * as echarts from 'echarts/core';
import {EChartsCoreOption} from 'echarts';
import {LineChart} from 'echarts/charts';
import {CanvasRenderer} from 'echarts/renderers';
import {GridComponent, TooltipComponent} from 'echarts/components';
echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer]);

@Component({
	selector: 'app-tour-details-view',
	imports: [
		DecimalPipe,
		MatListItem,
		MatListItemLine,
		MatListItemTitle,
		DistancePipe,
		DurationPipe,
		RouterLink,
		MatActionList,
		TourMapComponent,
		DatetimePipe,
		FaIconComponent,
		MatButton,
		NgxEchartsDirective,
	],
	providers: [
		provideEchartsCore({ echarts }),
		DistancePipe,
	],
	templateUrl: './tour-details-view.component.html',
	styleUrl: './tour-details-view.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourDetailsViewComponent {
	public tour = input.required<Tour>();
	protected readonly faMedal = faMedal;
	private readonly distancePipe = inject(DistancePipe);

	numGold = computed(() => {
		return this.tour().segmentRecords.filter((record) => record.rankCreated == 1).length;
	});

	numSilver = computed(() => {
		return this.tour().segmentRecords.filter((record) => record.rankCreated == 2).length;
	});

	numBronze = computed(() => {
		return this.tour().segmentRecords.filter((record) => record.rankCreated == 3).length;
	});

	elevationEchartsOptions: Signal<EChartsCoreOption> = computed(() => {
		const track = this.tour().track;
		const elevations = track.map((trackPoint) => trackPoint.el);
		const distances = [0];

		for (let i = 0; i < elevations.length - 1; i++) {
			distances.push(
				this.distancePipe.transform([[track[i].lat, track[i].lon], [track[i + 1].lat, track[i + 1].lon]])
				+ distances[i]
			);
		}

		return {
			series: [
				{
					name: 'Elevation',
					type: 'line',
					data: elevations,
					areaStyle: {}
				}
			],
			yAxis: {
				type: 'value',
				splitLine: {
					lineStyle: {
						type: 'dotted',
						color: 'gray'
					}
				},
				min: 'dataMin',
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: distances,
				axisLabel: {
					formatter: (value: number) => `${Math.round(value * 10) / 10} km`
				}
			},
			tooltip: {
				trigger: 'axis',
				formatter: (params: any) => {
					const xValue = params[0].axisValue; // x-axis value
					const yValue = params[0].value; // y-axis value
					const xFormatted = Math.round(xValue * 10) / 10; // Round x-axis value to 1 decimal place
					const yFormatted = Math.round(yValue); // Convert y-axis value to meters and round
					return `Distanz: ${xFormatted}km<br>Höhe: ${yFormatted}m`; // Format tooltip
				}
			},
			color: ['#ffafd3']
		}
	});

	heartRateEchartsOptions: Signal<EChartsCoreOption> = computed(() => {
		const track = this.tour().track;
		const heartRates = track.map((trackPoint) => trackPoint.hr);
		const distances = [0];

		for (let i = 0; i < heartRates.length - 1; i++) {
			distances.push(
				this.distancePipe.transform([[track[i].lat, track[i].lon], [track[i + 1].lat, track[i + 1].lon]])
				+ distances[i]
			);
		}

		return {
			series: [
				{
					name: 'Heart rate',
					type: 'line',
					data: heartRates,
					areaStyle: {}
				}
			],
			yAxis: {
				type: 'value',
				splitLine: {
					lineStyle: {
						type: 'dotted',
						color: 'gray'
					}
				},
				min: 'dataMin',
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: distances,
				axisLabel: {
					formatter: (value: number) => `${Math.round(value * 10) / 10} km`
				}
			},
			tooltip: {
				trigger: 'axis',
				formatter: (params: any) => {
					const xValue = params[0].axisValue; // x-axis value
					const yValue = params[0].value; // y-axis value
					const xFormatted = Math.round(xValue * 10) / 10; // Round x-axis value to 1 decimal place
					const yFormatted = Math.round(yValue); // Convert y-axis value to meters and round
					return `Distanz: ${xFormatted}km<br>Herzfrequenz: ${yFormatted} bpm`; // Format tooltip
				}
			},
			color: ['#ec7a95']
		}
	});
}
