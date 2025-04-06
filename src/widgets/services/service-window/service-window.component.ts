import { Component, Inject, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IService, ServicesApiService } from '@entity';

@Component({
  selector: 'app-service-window',
  standalone: true,
  imports: [],
  templateUrl: './service-window.component.html',
  styleUrl: './service-window.component.scss',
})
export class ServiceWindowComponent {
  @Output() service = new EventEmitter<any>();
  private creatorId: string = 'd52c32d6-0b2b-46e8-b16f-386fdd20d47d';

  constructor(
    private _dialogRef: MatDialogRef<ServiceWindowComponent>,
    private _serviceApiService: ServicesApiService,
    @Inject(MAT_DIALOG_DATA) public data: IService | null
  ) {
    this.#loadDepartment();
    this.#loadUsers();
    if (this.data) {
    }
  }

  #loadUsers() {}

  #loadDepartment() {}

  form = new FormGroup({
    id: new FormControl<string | null>(null, Validators.required),
    name: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null, Validators.required),
    price: new FormControl<number | null>(null, Validators.required),
  });

  initializeForm(service: IService) {
    this.form.patchValue({
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price,
    });
  }

  submit() {
    if (this.form.valid) {
      const serviceData = this.form.value;
      if (serviceData.name) {
        this.updateService(serviceData);
      }
    }
  }

  updateService(service: any) {
    this._serviceApiService.updateService(service).subscribe({
      next: (response) => {
        console.log('Обновлен пользователь:', response);
        this._dialogRef.close(response);
      },
      error: (error) => {
        console.error('Ошибка при обновлении пользователя:', error);
      },
    });
  }

  onClickClose(){
    this._dialogRef.close()
  }
}
