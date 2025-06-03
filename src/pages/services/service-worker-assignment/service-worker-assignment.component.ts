import { Component } from '@angular/core';
import { ServicesApiService, IWorkerOnService, IService } from '@entity';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ServiceWorkerAssignmentComponentWindow } from 'src/widgets/services/service-worker-window/service-worker-assignment.component';
import { BehaviorSubject } from 'rxjs';
import { AppTreeNode, ServiceTreeNode, WorkerNode } from '@entity';


@Component({
  selector: 'app-service-worker-assignment',
  standalone: true,
  imports: [
    CommonModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  templateUrl: './service-worker-assignment.component.html',
  styleUrls: ['./service-worker-assignment.component.scss'],
})
export class ServiceWorkerAssignmentComponent {
  private _treeControl = new NestedTreeControl<AppTreeNode>(
    (node) => node.children
  );
  private _dataSource = new MatTreeNestedDataSource<AppTreeNode>();
  private _isLoading = true;

  private _page$ = new BehaviorSubject<number>(1);
  private _pageSize$ = new BehaviorSubject<number>(1000);

  constructor(
    private _servicesApi: ServicesApiService,
    private _dialog: MatDialog
  ) {
    this.loadServices();
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

  hasChild = (_: number, node: AppTreeNode) => {
    if (this.isServiceNode(node)) {
      return !node.workersLoaded || (node.children && node.children.length > 0);
    }
    return false;
  };

  loadServices(): void {
    this._isLoading = true;
    this._servicesApi
      .getService({ page: this._page$.value, pageSize: this._pageSize$.value })
      .subscribe({
        next: (serviceResponse) => {
          const services = serviceResponse.rows || [];
          const treeData: ServiceTreeNode[] = services.map((service) => ({
            id: service.id,
            name: service.name || `Услуга #${service.id}`,
            children: [],
            rawService: service,
            workersLoaded: false,
          }));
          this._dataSource.data = treeData;
          this._isLoading = false;
        },
        error: (err) => {
          console.error('Ошибка при загрузке услуг:', err);
          this._isLoading = false;
        },
      });
  }

  onServiceNodeToggle(node: ServiceTreeNode): void {
    if (this._treeControl.isExpanded(node) && !node.workersLoaded) {
      this._servicesApi.getWorkersForService(node.id).subscribe({
        next: (workerAssignmentsResponse) => {
          const workerAssignments = workerAssignmentsResponse.rows || [];
          const workerNodes: WorkerNode[] = workerAssignments.map((item) => ({
            id: item.worker.id,
            name: `${item.worker.firstName} ${item.worker.lastName}`,
          }));
          node.children = workerNodes;
          node.workersLoaded = true;
          this._dataSource.data = [...this._dataSource.data!];
        },
        error: (err) => {
          console.error(
            `Ошибка при загрузке мастеров для услуги ${node.name}:`,
            err
          );
        },
      });
    }
  }

  toggleService(node: ServiceTreeNode): void {
  const expanded = this._treeControl.isExpanded(node);
  if (!expanded && !node.workersLoaded) {
    this._servicesApi.getWorkersForService(node.id).subscribe({
      next: (workerAssignmentsResponse) => {
        const workerAssignments = workerAssignmentsResponse.rows || [];
        const workerNodes: WorkerNode[] = workerAssignments.map((item) => ({
          id: item.worker.id,
          name: `${item.worker.firstName} ${item.worker.lastName}`,
        }));
        node.children = workerNodes;
        node.workersLoaded = true;
        this._dataSource.data = [...this._dataSource.data!];
        this._treeControl.expand(node);
      },
      error: (err) => {
        console.error(
          `Ошибка при загрузке мастеров для услуги ${node.name}:`,
          err
        );
      },
    });
  } else {
    expanded
      ? this._treeControl.collapse(node)
      : this._treeControl.expand(node);
  }
}


  isServiceNode(node: AppTreeNode): node is ServiceTreeNode {
    return (node as ServiceTreeNode).rawService !== undefined;
  }

  openAssignmentModal(service: IService): void {
    const dialogRef = this._dialog.open(
      ServiceWorkerAssignmentComponentWindow,
      {
        data: { serviceId: service.id },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadServices();
      }
    });
  }
}
