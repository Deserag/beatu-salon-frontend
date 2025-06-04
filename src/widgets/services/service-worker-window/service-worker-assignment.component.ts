import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ServicesApiService, UserApiService } from '@entity';
import { IService, IUser, TResGetService, IReqPage, TResGetUsers } from '@entity';

interface DialogData {
  serviceId?: string;
}

@Component({
  selector: 'app-service-worker-assignment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './service-worker-assignment.component.html',
  styleUrls: ['./service-worker-assignment.component.scss'],
})
export class ServiceWorkerAssignmentComponentWindow {
  assignmentForm: FormGroup;
  availableWorkers: IUser[] = [];
  service: IService | null = null;
  errorMessage: string = '';
  services: IService[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ServiceWorkerAssignmentComponentWindow>,
    private servicesApiService: ServicesApiService,
    private userApiService: UserApiService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.assignmentForm = this.fb.group({
      serviceId: ['', Validators.required],
      workers: ['', Validators.required],
    });
    this.loadAvailableWorkers();
    this.loadServices();
    if (data?.serviceId) {
      this.assignmentForm.patchValue({ serviceId: data.serviceId });
      this.loadServiceDetails(data.serviceId);
    }
  }

  loadServices(): void {
    const pagination: IReqPage = { page: 1, pageSize: 1000 };
    this.servicesApiService.getService(pagination).subscribe({
      next: (response: TResGetService) => {
        this.services = response?.rows || [];
      },
      error: (error: any) => {
        console.error('Ошибка при загрузке списка услуг:', error);
        this.errorMessage = 'Ошибка при загрузке списка услуг.';
      },
    });
  }

  loadServiceDetails(serviceId: string): void {
    this.servicesApiService.getServiceById(serviceId).subscribe({
      next: (response: TResGetService) => {
        this.service = response?.rows?.[0] || null;
        if (!this.service) {
          this.errorMessage = 'Не удалось загрузить информацию о сервисе.';
        }
      },
      error: (error: any) => {
        console.error('Ошибка при загрузке информации о сервисе:', error);
        this.errorMessage = 'Ошибка при загрузке информации о сервисе.';
      },
    });
  }

  loadAvailableWorkers(): void {
    const pagination: IReqPage = { page: 1, pageSize: 1000 };
    this.userApiService.getUser(pagination).subscribe({
      next: (response: TResGetUsers) => {
        this.availableWorkers = response?.rows || [];
      },
      error: (error: any) => {
        console.error('Ошибка при загрузке списка мастеров:', error);
        this.errorMessage = 'Ошибка при загрузке списка мастеров.';
      },
    });
  }

  onSubmit(): void {
    if (this.assignmentForm.valid) {
      const selectedWorkerIds = this.assignmentForm.get('workers')?.value as string[];
      const serviceId = this.assignmentForm.value['serviceId'];
      const creatorId = this._getCreatorId();
  
      if (serviceId && selectedWorkerIds && selectedWorkerIds.length > 0 && creatorId) {
        const payload = {
          serviceId,
          userIds: selectedWorkerIds,
          creatorId,
        };
  
        this.servicesApiService.createWorkerOnService(payload).subscribe({
          next: (response) => {
            console.log('Мастера успешно назначены:', response);
            this.dialogRef.close(true);
          },
          error: (error: any) => {
            console.error('Ошибка при назначении мастеров:', error);
            this.errorMessage = 'Ошибка при назначении мастеров.';
          },
        });
      } else {
        this.errorMessage = 'Пожалуйста, выберите сервис, хотя бы одного мастера и убедитесь, что вы авторизованы.';
      }
    } else {
      this.errorMessage = 'Форма не валидна. Проверьте поля.';
    }
  }
  

  onCancel(): void {
    this.dialogRef.close(false);
  }

  private _getCreatorId(): string | null {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user?.id || null;
    } catch {
      return null;
    }
  }
}