import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {  IUserRoles, UserApiService } from '@entity';
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
  private creatorId: string = 'd52c32d6-0b2b-46e8-b16f-386fdd20d47d';
  roles: IUserRoles[] = [];
  constructor(
    private _dialogRef: MatDialogRef<UserWindowComponent>,
    private _userApiService: UserApiService
  ) {
    this.loadRoles()
  }

  form = new FormGroup({
    firstName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    middleName: new FormControl<string>(''),
    birthDate: new FormControl<Date>(new Date(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    
    department: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    login: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$'
      ),
    ]),
    telegramId: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    roleId: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  submit() {
    if (this.form.valid) {
      this.user.emit(this.form.value);
      this._dialogRef.close();
    } else {
      this.form.markAllAsTouched();
    }
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

  close() {
    this._dialogRef.close();
  }
  onClickCreateUser() {
    if (this.form.valid) {
      const formData = {
        ...this.form.value,
        // creatorId: this.creatorId,
        firstName: this.form.value.firstName || '',
        lastName: this.form.value.lastName || '',
        birthDate: this.form.value.birthDate instanceof Date && !isNaN(this.form.value.birthDate.getTime()) 
          ? this.form.value.birthDate.toISOString() 
          : new Date().toISOString(),  
        department: this.form.value.department || '',
        login: this.form.value.login || '',
        email: this.form.value.email || '',
        password: this.form.value.password || '',
        telegramId: this.form.value.telegramId || '',
        roleId: this.form.value.roleId!,
      };
      console.log('Отправка данных на сервер:', formData);
      this._userApiService.createUser(formData).subscribe({
        next: (response) => {
          console.log('Ответ от сервера:', response);
        },
        error: (error) => {
          console.error('Ошибка при создании пользователя:', error);
        },
      });
    }
  }
  
}
