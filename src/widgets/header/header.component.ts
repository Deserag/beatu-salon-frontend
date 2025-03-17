import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '@entity';
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
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  userName = 'Имя пользователя';
  protected readonly ERoutesConstans = ERouteConstans;
  readonly #authService = inject(AuthService);

  protected onClickLogOut(): void {
    this.#authService.logout();
  }

  get isAuthenticated(): boolean {
    return this.#authService.isAuthenticated();
  }

  get user() {
    return this.#authService.user;
  }
}