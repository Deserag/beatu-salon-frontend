import { Component, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserApiService } from '@entity';
import { EventEmitter } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-department-window',
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
  templateUrl: './department-window.component.html',
  styleUrl: './department-window.component.scss',
})
export class DepartmentWindowComponent {
  @Output() department = new EventEmitter<any>();
  private creatorId: string = 'd52c32d6-0b2b-46e8-b16f-386fdd20d47d';
  constructor(
    private _dialogRef: MatDialogRef<DepartmentWindowComponent>,
    private _userApiService: UserApiService
  ) {
  }

  form = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required],
    })
  })

  submit() {
    if (this.form.valid) {
      this.department.emit(this.form.value)
      this._dialogRef.close()
    }
    else {
      this.form.markAllAsTouched()
    }
  }

  onClickClose() {
    this._dialogRef.close()
  }

  onClickCreateDepartment() {
    if (this.form.valid){
      const FormData = {
        ...this.form.value,
        name: this.form.value.name || '',
        description: this.form.value.description || '',
        creatorId: this.creatorId
      }
      this._userApiService.createDepartment(FormData).subscribe({
        next: (response) => {
          console.log('Ответ от сервера:', response);
        },
        error: (error) => {
          console.error('Ошибка при создании отдела:', error);
        },
      })
    }
  }


}
