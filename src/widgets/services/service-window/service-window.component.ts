import { NgFor, NgIf } from '@angular/common';
import { Component, Inject, Output, inject, DestroyRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IService, ServicesApiService } from '@entity';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-service-window',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgFor,
    NgIf,
  ],
  templateUrl: './service-window.component.html',
  styleUrl: './service-window.component.scss',
})
export class ServiceWindowComponent {
  @Output() service = new EventEmitter<any>();
  private creatorId: string;

  private destroyRef = inject(DestroyRef);

  constructor(
    private _dialogRef: MatDialogRef<ServiceWindowComponent>,
    private _serviceApiService: ServicesApiService,
    @Inject(MAT_DIALOG_DATA) public data: IService | null
  ) {
    this.creatorId = (() => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user?.id || '';
      } catch {
        return '';
      }
    })();

    if (this.data) {
      this.initializeForm(this.data);
    }
  }

  form = new FormGroup({
    id: new FormControl<string | null>(null),
    name: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null, Validators.required),
    price: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
    ]),
    duration: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
    ]),
  });

  initializeForm(service: IService) {
    this.form.patchValue({
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
    });
  }

  submit() {
    if (this.form.valid && this.creatorId) {
      const serviceData = this.form.value;

      if (serviceData.id) {
        this.saveService({
          id: serviceData.id,
          name: serviceData.name!,
          description: serviceData.description!,
          price: serviceData.price!,
          duration: serviceData.duration!,
          editorId: this.creatorId,
        });
      } else {
        const { id, ...createServiceData } = serviceData;
        this.saveService({
          name: createServiceData.name!,
          description: createServiceData.description!,
          price: createServiceData.price!,
          duration: createServiceData.duration!,
          creatorId: this.creatorId,
        });
      }
    }
  }

  saveService(service: any) {
    let apiCall;
    if (service.id) {
      apiCall = this._serviceApiService.updateService(service);
    } else {
      apiCall = this._serviceApiService.createService(service);
    }

    apiCall.subscribe({
      next: (response) => {
        console.log('Услуга сохранена:', response);
        this._dialogRef.close(response);
      },
      error: (error) => {
        console.error('Ошибка при сохранении услуги:', error);
      },
    });
  }

  onClickClose() {
    this._dialogRef.close();
  }
}
