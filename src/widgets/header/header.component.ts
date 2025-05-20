import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService, IGetUser, UserApiService } from '@entity';
import { ERouteConstans } from '@routes';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatMenuModule,
    NgIf,
    MatExpansionModule,
    RouterOutlet,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  protected readonly ERoutesConstans = ERouteConstans;
  readonly #authService = inject(AuthService);
  readonly #userApiService = inject(UserApiService);

  userName = '';
  userRoleId = '';
  adminRoleId = '';
  superAdminRoleId = '';

  constructor() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.#userApiService.getUserInfo(userId).subscribe({
        next: (response: IGetUser) => {
          const { firstName = '', lastName = '', roleId = '' } = response.user;
          this.userName =
            `${lastName} ${firstName}`.trim() || 'Имя пользователя';
          this.userRoleId = roleId;
          this.loadRoles();
        },
        error: () => {
          this.userName = 'Имя пользователя';
        },
      });
    }
  }

  loadRoles() {
    this.#userApiService
      .getUserRole({ name: '', page: 1, pageSize: 10 })
      .subscribe({
        next: (roles) => {
          const admin = roles.rows.find(
            (r) => r.name.toLowerCase() === 'admin'
          );
          const superAdmin = roles.rows.find(
            (r) => r.name.toLowerCase() === 'superadmin'
          );
          this.adminRoleId = admin?.id || '';
          this.superAdminRoleId = superAdmin?.id || '';
        },
        error: () => {
          this.adminRoleId = '';
          this.superAdminRoleId = '';
        },
      });
  }

  onClickLogOut() {
    this.#authService.logout();
  }

  get isAuthenticated(): boolean {
    return this.#authService.isAuthenticated();
  }

  get isAdminOrSuperAdmin(): boolean {
    return (
      this.userRoleId === this.adminRoleId ||
      this.userRoleId === this.superAdminRoleId
    );
  }
}
