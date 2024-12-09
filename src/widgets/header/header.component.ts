import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@entity';
import { ERouteConstans } from '@routes';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  protected readonly ERoutesConstans = ERouteConstans;
  readonly #authService = inject(AuthService);
  protected onClickLogOut(): void{
    this. #authService.logout();
  }
}
