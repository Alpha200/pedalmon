import {Routes} from '@angular/router';
import {AutoLoginPartialRoutesGuard} from 'angular-auth-oidc-client';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./app-frame/app-frame.component').then(m => m.AppFrameComponent),
		canActivate: [AutoLoginPartialRoutesGuard],
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'tours',
			},
			{
				path: 'upload-tour',
				loadComponent: () => import('./tours/upload-tour/upload-tour.component').then(m => m.UploadTourComponent),
			},
			{
				path: 'tours',
				loadComponent: () => import('./tours/tours/tours.component').then(m => m.ToursComponent),
			},
			{
				path: 'map',
				loadComponent: () => import('./map/live-map/live-map.component').then(m => m.LiveMapComponent),
			},
			{
				path: 'tours/:id',
				loadComponent: () => import('./tours/tour-details/tour-details.component').then(m => m.TourDetailsComponent),
			},
			{
				path: 'tours/:id/create-segment',
				loadComponent: () => import('./tours/create-segment/create-segment.component').then(m => m.CreateSegmentComponent),
			},
			{
				path: 'segments/:id',
				loadComponent: () => import('./segments/segment-details/segment-details.component').then(m => m.SegmentDetailsComponent),
			}
		]
	},
];
