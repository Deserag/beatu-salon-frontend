import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ERouteConstans } from '@routes';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [MatSidenavModule,  RouterOutlet],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent {
  protected readonly ERoutesConstans = ERouteConstans;
}
