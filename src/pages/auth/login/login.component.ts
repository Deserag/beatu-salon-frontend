import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, IResAuthLogin } from '@entity';
import { NgIf } from '@angular/common';
import { ERouteConstans } from '@routes';

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
  protected errorMessage: string | null = null;

  constructor(private router: Router, private _authService: AuthService) {}

  protected submit() {
    if (this.loginForm.valid) {
      const { login, password } = this.loginForm.getRawValue();
      const deviceId = this._authService.deviceId;

      this._authService.login({ login, password, deviceId }).subscribe({
        next: (response: IResAuthLogin) => {
          const user = response?.user;
          if (user?.id) {
            localStorage.setItem('userId', user.id.toString());
          }

          const redirectUrl = sessionStorage.getItem('redirectUrl');
          if (redirectUrl) {
            sessionStorage.removeItem('redirectUrl');
            this.router.navigate([redirectUrl]);
          } else {
            this.router.navigate([ERouteConstans.MAIN]);
          }
        },
        error: () => {
          this.errorMessage = 'Неверный логин или пароль';
          this.loginForm.reset(); 
        },
      });
    } else {
      this.errorMessage = 'Пожалуйста, заполните все обязательные поля';
    }
  }
}
