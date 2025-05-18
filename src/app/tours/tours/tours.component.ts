import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {TourListComponent} from '../tour-list/tour-list.component';
import {ToursStore} from '../../shared/store/tours.store';
import {InfiniteScrollDirective} from 'ngx-infinite-scroll';
import {LoadingSpinnerComponent} from '../../shared/component/loading-spinner/loading-spinner.component';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';

@Component({
	selector: 'app-tours',
	imports: [
		TourListComponent,
		InfiniteScrollDirective,
		LoadingSpinnerComponent,
		MatFabButton,
		MatIcon,
		RouterLink,
	],
	templateUrl: './tours.component.html',
	styleUrl: './tours.component.scss',
	providers: [ToursStore],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToursComponent implements OnInit {
	readonly store = inject(ToursStore);

	ngOnInit(): void {
		this.store.loadNext().then();
	}

	onScroll() {
		if (!this.store.isPending()) {
			this.store.loadNext().then();
		}
	}
}
