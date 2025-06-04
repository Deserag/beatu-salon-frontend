import { Component, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ServicesApiService, IServiceWithWorkers } from '@entity';
import { ServiceWorkerModalComponentWindow } from 'src/widgets/services/service-worker-window/service-worker-modal.component';

@Component({
  selector: 'app-service-worker-assignment',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressBarModule,
    MatListModule,
    MatDialogModule,
  ],
  templateUrl: './service-worker-assignment.component.html',
  styleUrls: ['./service-worker-assignment.component.scss'],
})
export class ServiceWorkerAssignmentComponent {
  services: IServiceWithWorkers[] = [];
  isLoading = false;
  errorMessage = '';

  private api = inject(ServicesApiService);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);

  constructor() {
    this.loadServicesWithWorkers();
  }

  loadServicesWithWorkers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.api
      .getAllServicesWithWorkers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.services = Object.values(res);
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Ошибка при загрузке услуг с мастерами.';
          this.isLoading = false;
        },
      });
  }

  openAssignDialog(serviceId?: string): void {
    const dialogRef = this.dialog.open(ServiceWorkerModalComponentWindow, {
      data: { serviceId },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadServicesWithWorkers();
      }
    });
  }
}
