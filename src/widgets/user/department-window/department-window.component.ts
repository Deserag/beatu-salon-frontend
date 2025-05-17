import { Component, DestroyRef, Output, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ICreateDepartment, UserApiService } from '@entity';
import { EventEmitter } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@entity';

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
  @Output() department = new EventEmitter<any>();
  private _dialogRef = inject(MatDialogRef<DepartmentWindowComponent>);
  private _userApiService = inject(UserApiService);
  private _destroyRef = inject(DestroyRef);
  private _snackBar = inject(MatSnackBar);
  private _authService = inject(AuthService);
  form = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
  });

  submit() {
    if (this.form.valid) {
      this.department.emit(this.form.value);
      this._dialogRef.close();
    } else {
      this.form.markAllAsTouched();
    }
  }

  onClickClose() {
    this.department.emit(this.form.value);
    this._dialogRef.close();
  }

  onClickCreateDepartment() {
    if (this.form.valid) {
      const formData: ICreateDepartment = {
        name: this.form.controls.name.value ?? '',
        description: this.form.controls.description.value ?? '',
      };

      this._userApiService
        .createDepartment(formData)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (response) => {
            this.onClickClose();
            this._snackBar.open(
              `Отделение "${response.name}" успешно создано`,
              'Закрыть',
              { duration: 3000 }
            );
          },
          error: (error) => {
            console.error('Ошибка при создании отдела:', error);
            this._snackBar.open(
              `Ошибка создания отделения: ${error.message}`,
              'Закрыть',
              {
                duration: 5000,
                panelClass: ['error-snackbar'],
              }
            );
          },
        });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
