import { Component } from '@angular/core';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatDialog } from '@angular/material/dialog';
import { ServiceWorkerAssignmentComponentWindow } from 'src/widgets/services/service-worker-window/service-worker-assignment.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

interface Worker {
  id: number;
  firstName: string;
  lastName: string;
}

interface IService {
  id: number;
  name: string;
}

interface AppTreeNode {
  id: number;
  name: string;
  children?: AppTreeNode[];
}

interface ServiceTreeNode extends AppTreeNode {
  rawService: IService;
  workersLoaded: boolean;
}

interface WorkerNode extends AppTreeNode {}

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
  private _treeControl = new NestedTreeControl<AppTreeNode>((node) => node.children);
  private _dataSource = new MatTreeNestedDataSource<AppTreeNode>();
  private _isLoading = true;

  constructor(private _dialog: MatDialog) {
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
    return this.isServiceNode(node)
      ? !node.workersLoaded || (node.children && node.children.length > 0)
      : false;
  };

  loadServices(): void {
    this._isLoading = true;

    const mockServices: IService[] = [
      { id: 1, name: 'Парикмахерские услуги' },
      { id: 2, name: 'Маникюр и педикюр' },
      { id: 3, name: 'Массаж' },
    ];

    const treeData: ServiceTreeNode[] = mockServices.map((service) => ({
      id: service.id,
      name: service.name,
      children: [],
      rawService: service,
      workersLoaded: false,
    }));

    this._dataSource.data = treeData;
    this._isLoading = false;
  }

  toggleService(node: ServiceTreeNode): void {
    const expanded = this._treeControl.isExpanded(node);

    if (!expanded && !node.workersLoaded) {
      // Мок-данные для мастеров, зависящие от ID услуги
      let mockWorkerAssignments: Worker[] = [];
      if (node.id === 1) {
        mockWorkerAssignments = [
          { id: 101, firstName: 'Марина', lastName: 'Иванова' },
          { id: 102, firstName: 'Ольга', lastName: 'Петрова' },
        ];
      } else if (node.id === 2) {
        mockWorkerAssignments = [
          { id: 201, firstName: 'Елена', lastName: 'Смирнова' },
          { id: 202, firstName: 'Дарья', lastName: 'Козлова' },
        ];
      } else if (node.id === 3) {
        mockWorkerAssignments = [
          { id: 301, firstName: 'Алексей', lastName: 'Сидоров' },
          { id: 302, firstName: 'Игорь', lastName: 'Кузнецов' },
        ];
      }

      const workerNodes: WorkerNode[] = mockWorkerAssignments.map((worker) => ({
        id: worker.id,
        name: `${worker.firstName} ${worker.lastName}`,
      }));

      node.children = workerNodes;
      node.workersLoaded = true;
      this._dataSource.data = [...this._dataSource.data];
      this._treeControl.expand(node);
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
    const dialogRef = this._dialog.open(ServiceWorkerAssignmentComponentWindow, {
      data: { serviceId: service.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadServices();
      }
    });
  }
}