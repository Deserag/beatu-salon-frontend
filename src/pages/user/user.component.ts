import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ERouteConstans } from '@routes';
import { MatSidenavModule } from '@angular/material/sidenav';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatSidenavModule, RouterOutlet],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  protected readonly ERoutesConstans = ERouteConstans;
}
