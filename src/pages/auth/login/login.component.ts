import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@entity';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  protected loginForm = new FormGroup({
    login: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required], 
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected showPassword = false;

  constructor(
    private router: Router,
    private _authService: AuthService
  ) {}

  protected submit() {
    if (this.loginForm.valid) {
      const { login, password } = this.loginForm.getRawValue();
      const deviceId = this._authService.deviceId;
      this._authService
        .login({ login: login, password, deviceId })
        .subscribe({
          next: () => {
            this.router.navigate(['/']).then();
          },
          error: (err) => {
            console.error('вход не удался:', err);
          },
        });
    } else {
      console.log('форма не валидна');
    }
  }
}
