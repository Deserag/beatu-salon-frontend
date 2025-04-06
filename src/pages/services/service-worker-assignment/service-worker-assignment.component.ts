import { Component, OnInit } from '@angular/core';
import { ServicesApiService, IWorkerOnService } from '@entity';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { map } from 'rxjs/operators';

interface ServiceTreeNode {
  name: string;
  children?: WorkerNode[];
  id: string;
}

interface WorkerNode {
  name: string;
  id: string;
}

@Component({
  selector: 'app-service-worker-assignment',
  standalone: true,
  imports: [
    CommonModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule
  ],
  templateUrl: './service-worker-assignment.component.html'
})
export class ServiceWorkerAssignmentComponent implements OnInit {
  private _treeControl = new NestedTreeControl<ServiceTreeNode>(node => node.children);
  private _dataSource = new MatTreeNestedDataSource<ServiceTreeNode>();
  private _isLoading = true;

  constructor(
    private _servicesApi: ServicesApiService,
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this._loadServicesWithWorkers();
  }

  get treeControl() {
    return this._treeControl;
  }

  get dataSource() {
    return this._dataSource;
  }

  get isLoading() {
    return this._isLoading;
  }

  hasChild = (_: number, node: ServiceTreeNode) => !!node.children && node.children.length > 0;

  private _loadServicesWithWorkers(): void {
    this._isLoading = true;
    this._servicesApi.getServicesWithWorkers({ page: 1, pageSize: 100 }).pipe(
      map((response: IWorkerOnService[]) => {
        const servicesMap = new Map<string, ServiceTreeNode>();
        response.forEach((item: IWorkerOnService) => {
          const serviceId = item.serviceId;
          const workerNode: WorkerNode = {
            id: item.worker.id,
            name: `${item.worker.firstName} ${item.worker.lastName}`
          };

          if (servicesMap.has(serviceId)) {
            const serviceNode = servicesMap.get(serviceId)!;
            if (serviceNode.children) {
              serviceNode.children.push(workerNode);
            } else {
              serviceNode.children = [workerNode];
            }
          } else {
            servicesMap.set(serviceId, {
              id: serviceId,
              name: `Услуга #${serviceId}`, // Вам может потребоваться отдельный запрос для получения названия услуги
              children: [workerNode]
            });
          }
        });
        return Array.from(servicesMap.values());
      })
    ).subscribe({
      next: (treeData) => {
        this._dataSource.data = treeData;
        this._isLoading = false;
      },
      error: (err) => {
        console.error('Error loading services with workers', err);
        this._isLoading = false;
      }
    });
  }

  openAssignmentModal(): void {
    const dialogRef = this._dialog.open(ServiceWorkerAssignmentComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._loadServicesWithWorkers();
      }
    });
  }
}