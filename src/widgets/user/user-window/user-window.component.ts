import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
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
import { IUser, IUserDepartment, IUserRoles, UserApiService } from '@entity';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-user-window',
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
  templateUrl: './user-window.component.html',
  styleUrls: ['./user-window.component.scss'],
})
export class UserWindowComponent {
  @Output() user = new EventEmitter<any>();
  roles: IUserRoles[] = [];
  departments: IUserDepartment[] = [];

  constructor(
    private _dialogRef: MatDialogRef<UserWindowComponent>,
    private _userApiService: UserApiService,
    @Inject(MAT_DIALOG_DATA) public data: IUser | null
  ) {
    this.loadRoles();
    this.loadDepartaments();
    if (this.data) {
      this.initializeForm(this.data);
    }
  }

  form = new FormGroup({
    id: new FormControl<string | null>(null),
    firstName: new FormControl<string>('', Validators.required),
    lastName: new FormControl<string>('', Validators.required),
    middleName: new FormControl<string>(''),
    birthDate: new FormControl<Date | null>(null, Validators.required),
    departments: new FormControl<string[]>([], Validators.required),
    login: new FormControl<string>('', Validators.required),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string | null>(null, [
      Validators.minLength(8),
      Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$'
      ),
    ]),
    telegramId: new FormControl<string>('', Validators.required),
    roleId: new FormControl<string>('', Validators.required),
  });

  initializeForm(user: IUser) {
    this.form.patchValue({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      birthDate: new Date(user.birthDate),
      departments: user.departments,
      login: user.login,
      email: user.email,
      telegramId: user.telegramId,
      roleId: user.roleId,
    });
    this.form.controls.password.setValidators(null);
  }

  submit() {
    if (this.form.valid) {
      const userData = this.form.value;

      if (userData.id) {
        this.updateUser(userData);
      } else {
        const { id, ...userWithoutId } = userData;
        this.onClickCreateUser(userWithoutId);
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  onClickCreateUser(user: any) {
    this._userApiService.createUser(user).subscribe({
      next: (response) => {
        console.log('Создан пользователь:', response);
        this._dialogRef.close(response);
      },
      error: (error) => {
        console.error('Ошибка при создании пользователя:', error);
      },
    });
  }

  updateUser(user: any) {
    this._userApiService.updateUser(user).subscribe({
      next: (response) => {
        console.log('Обновлен пользователь:', response);
        this._dialogRef.close(response);
      },
      error: (error) => {
        console.error('Ошибка при обновлении пользователя:', error);
      },
    });
  }

  loadRoles() {
    this._userApiService.getUserRoles().subscribe({
      next: (response) => {
        this.roles = response;
      },
      error: (error) => {
        console.error('Ошибка при получении ролей:', error);
      },
    });
  }

  loadDepartaments() {
    this._userApiService.getDepartaments().subscribe({
      next: (response) => {
        this.departments = response;
      },
      error: (error) => {
        console.error('Ошибка при получении отделов:', error);
      },
    });
  }

  close() {
    this._dialogRef.close();
  }
}
