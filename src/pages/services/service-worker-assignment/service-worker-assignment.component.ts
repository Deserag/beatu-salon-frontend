// service-worker-assignment.component.ts
import { Component } from '@angular/core';
import { IServiceNode, ServicesApiService } from '@entity';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { IWorkerOnService, IServiceWithWorkers, IGetServicesWithWorkersResponse } from '@entity';
import { MatDialog } from '@angular/material/dialog';
import { ServiceWorkerAssignmentComponentWindow } from 'src/widgets/services/service-worker-assignment/service-worker-assignment.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-service-worker-assignment',
  standalone: true,
  imports: [
    CommonModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatTreeModule,
    MatProgressBarModule
  ],
  templateUrl: './service-worker-assignment.component.html'
})
export class ServiceWorkerAssignmentComponent {
  treeControl = new NestedTreeControl<IServiceNode>(node => node.workers);
  dataSource = new MatTreeNestedDataSource<IServiceNode>();
  isLoading = true;

  constructor(
    private servicesApi: ServicesApiService,
    private dialog: MatDialog
  ) {
    this.loadServicesWithWorkers();
  }

  hasChild = (_: number, node: IServiceNode) => !!node.workers && node.workers.length > 0;

  private loadServicesWithWorkers(): void {
    this.isLoading = true;
    this.servicesApi.getServicesWithWorkers({ page: 1, pageSize: 100}).subscribe({
      next: (response: IGetServicesWithWorkersResponse) => {
        this.dataSource.data = this.transformToTreeData(response.rows);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading services with workers', err);
        this.isLoading = false;
      }
    });
  }

  private transformToTreeData(services: IServiceWithWorkers[]): IServiceNode[] {
    return services.map(service => ({
      id: service.id,
      name: service.name,
      isService: true,
      workers: service.workers.map(worker => ({
        id: worker.userId,
        name: `${worker.worker.firstName} ${worker.worker.lastName}`,
        isService: false
      }))
    }));
  }

  openAssignmentModal(): void { // Удален аргумент serviceId
    const dialogRef = this.dialog.open(ServiceWorkerAssignmentComponentWindow, {
      width: '600px',
      // data: { serviceId } - Больше не передаем ID
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadServicesWithWorkers(); 
      }
    });
  }
}