import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {ToursService} from '../../shared/service/tours.service';
import {LoadingSpinnerComponent} from '../../shared/component/loading-spinner/loading-spinner.component';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
	selector: 'app-upload-tour',
	imports: [
		MatButton,
		LoadingSpinnerComponent,
	],
	templateUrl: './upload-tour.component.html',
	styleUrl: './upload-tour.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadTourComponent {
	readonly toursService = inject(ToursService);
	readonly snackBar = inject(MatSnackBar);
	readonly fileUploadStatus = signal<FileUploadStatus | undefined>(undefined);

	async fileUploadHandler($event: any) {
		const files: File[] = $event.target.files;

		let fileNumber = 0;

		for (const file of files) {
			fileNumber++;

			this.fileUploadStatus.set({
				numberOfFiles: files.length,
				currentFile: fileNumber,
				currentFileName: file.name,
				done: false,
			});

			try {
				if (file.name.endsWith('.tcx')) {
					await this.toursService.addTourTxc(await file.text());
				} else if (file.name.endsWith('.gpx')) {
					await this.toursService.addTourGpx(await file.text());
				}
			} catch (e) {
				console.error('Failed to upload file', e);
				this.snackBar.open(`Es ist ein unbekannter Fehler beim Importieren der Tour ${file.name} aufgetreten`);
			}
		}

		this.fileUploadStatus.set({
			done: true,
		});
	}
}

interface FileUploadStatus {
	numberOfFiles?: number;
	currentFile?: number;
	currentFileName?: string;
	done: boolean;
}
