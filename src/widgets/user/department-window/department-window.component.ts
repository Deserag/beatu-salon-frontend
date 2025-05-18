import { Component, Output, inject, Input, DestroyRef } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IUserDepartment, UserApiService } from '@entity';
import { EventEmitter } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-department-window',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './department-window.component.html',
  styleUrl: './department-window.component.scss',
})
export class DepartmentWindowComponent {
  @Output() department = new EventEmitter<void>();

  private _departmentData?: IUserDepartment;

  @Input()
  set departmentData(value: IUserDepartment | undefined) {
    this._departmentData = value;
    if (value) {
      this.form.patchValue({
        name: value.name,
        description: value.description,
      });
    }
  }
  get departmentData(): IUserDepartment | undefined {
    return this._departmentData;
  }

  private _dialogRef = inject(MatDialogRef<DepartmentWindowComponent>);
  private _userApiService = inject(UserApiService);
  private _destroyRef = inject(DestroyRef);
  private _snackBar = inject(MatSnackBar);

  form = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
  });

  get isEditMode(): boolean {
    return !!this.departmentData;
  }

  onClickClose() {
    this._dialogRef.close();
  }

  onClickCreateDepartment() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = {
      name: this.form.controls.name.value ?? '',
      description: this.form.controls.description.value ?? '',
    };

    if (this.isEditMode && this.departmentData?.id) {
      // Обновление
      this._userApiService
        .updateDepartment({ departmentId: this.departmentData.id, ...formData })
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: () => {
            this._snackBar.open(`Отделение обновлено`, 'Закрыть', {
              duration: 3000,
            });
            this._dialogRef.close();
            this.department.emit();
          },
          error: (err) => {
            this._snackBar.open(`Ошибка обновления: ${err.message}`, 'Закрыть', {
              duration: 5000,
              panelClass: ['error-snackbar'],
            });
          },
        });
    } else {
      // Создание
      this._userApiService
        .createDepartment(formData)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: () => {
            this._snackBar.open(`Отделение создано`, 'Закрыть', {
              duration: 3000,
            });
            this._dialogRef.close();
            this.department.emit();
          },
          error: (err) => {
            this._snackBar.open(`Ошибка создания: ${err.message}`, 'Закрыть', {
              duration: 5000,
              panelClass: ['error-snackbar'],
            });
          },
        });
    }
  }
}
