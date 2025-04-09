import { Component, Inject, EventEmitter, Output } from '@angular/core';
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
import {
  IOffice,
  OfficeApiService,
  ICreateOffice,
  IUpdateOffice,
} from '@entity';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-office-window',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './office-window.component.html',
  styleUrl: './office-window.component.scss',
})
export class OfficeWindowComponent {
  @Output() office = new EventEmitter<IOffice>();
  form = new FormGroup({
    id: new FormControl<string | null>(null),
    number: new FormControl<string>('', Validators.required),
    address: new FormControl<string>('', Validators.required),
  });
  private creatorId: string = 'd52c32d6-0b2b-46e8-b16f-386fdd20d47d';

  constructor(
    private _dialogRef: MatDialogRef<OfficeWindowComponent>,
    private _officeApiService: OfficeApiService,
    @Inject(MAT_DIALOG_DATA) public data: IOffice | null
  ) {
    if (this.data) {
      this.initializeForm(this.data);
    }
  }

  initializeForm(office: IOffice) {
    this.form.patchValue({
      id: office.id,
      number: office.number,
      address: office.address,
    });
  }

  submit() {
    if (this.form.valid) {
      const formData = this.form.value;
      if (formData.id) {
        const updateData: IUpdateOffice = {
          id: formData.id,
          number: formData.number!,
          address: formData.address!,
          creatorId: this.creatorId
        };
        this.updateOffice(updateData);
      } else {
        const createData: ICreateOffice = {
          number: formData.number!,
          address: formData.address!,
          creatorId: this.creatorId,
        };
        this.createOffice(createData);
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  createOffice(office: ICreateOffice) {
    this._officeApiService.createOffice(office).subscribe({
      next: (response) => {
        console.log('Офис создан:', response);
        this._dialogRef.close(response);
        this.office.emit(response);
      },
      error: (error) => {
        console.error('Ошибка при создании офиса:', error);
      },
    });
  }

  updateOffice(office: IUpdateOffice) {
    this._officeApiService.updateOffice(office).subscribe({
      next: (response) => {
        console.log('Офис обновлен:', response);
        this._dialogRef.close(response);
        this.office.emit(response);
      },
      error: (error) => {
        console.error('Ошибка при обновлении офиса:', error);
      },
    });
  }

  close() {
    this._dialogRef.close();
  }
}