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
@Component({
  selector: 'app-user-window',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './user-window.component.html',
  styleUrls: ['./user-window.component.scss'],
})
export class UserWindowComponent {
  @Output() user = new EventEmitter<any>();

  constructor(private _dialogRef: MatDialogRef<UserWindowComponent>) {}

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
  });

  submit() {
    if (this.form.valid) {
      this.user.emit(this.form.value);
      this._dialogRef.close();
    } else {
      this.form.markAllAsTouched();
    }
  }

  close() {
    this._dialogRef.close();
  }
}
