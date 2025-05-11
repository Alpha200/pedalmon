import {ChangeDetectionStrategy, Component, computed, HostListener, OnInit, signal, Signal} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterOutlet} from '@angular/router';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faBicycle, faMapLocationDot, faPlus, faUser} from '@fortawesome/free-solid-svg-icons';
import {filter, map} from 'rxjs';
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
export class AppFrameComponent implements OnInit {
	readonly faBicycle = faBicycle;
	readonly faPlus = faPlus;
	readonly faMapLocationDot = faMapLocationDot;
	readonly faUser = faUser;

	readonly isRouteToursActive: Signal<boolean>;
	readonly isRouteMapActive: Signal<boolean>;
	readonly contentWrapperHeight = signal<number>(0)

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

	ngOnInit(): void {
		this.updateScreenSize();
    }

	@HostListener('window:resize', ['$event'])
	updateScreenSize() {
		if (window.innerWidth < 600) {
			this.contentWrapperHeight.set(window.innerHeight - 80);
		} else {
			this.contentWrapperHeight.set(window.innerHeight);
		}
	}
}
