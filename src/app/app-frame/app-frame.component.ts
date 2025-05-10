import {ChangeDetectionStrategy, Component, computed, Signal} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet} from '@angular/router';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faBicycle, faMapLocationDot, faPlus, faUser} from '@fortawesome/free-solid-svg-icons';
import {filter, map, tap} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-app-frame',
	imports: [
		RouterOutlet,
		FaIconComponent,
		RouterLink,
	],
	templateUrl: './app-frame.component.html',
	styleUrl: './app-frame.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppFrameComponent {
	protected readonly faBicycle = faBicycle;
	protected readonly faPlus = faPlus;
	protected readonly faMapLocationDot = faMapLocationDot;
	protected readonly faUser = faUser;

	protected isRouteToursActive: Signal<boolean>;
	protected isRouteMapActive: Signal<boolean>;
	private readonly route: Signal<string | undefined>;

	constructor(
		router: Router,
	) {
		this.route = toSignal(router.events.pipe(
			filter((event) => event instanceof NavigationEnd),
			map((event) => event.urlAfterRedirects),
		));

		this.isRouteToursActive = computed(() => {
			const route = this.route();
			return route?.startsWith('/tours') ?? false;
		});

		this.isRouteMapActive = computed(() => {
			const route = this.route();
			return route?.startsWith('/map') ?? false;
		});
	}
}
