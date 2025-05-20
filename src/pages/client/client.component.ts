import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { ERouteConstans } from '@routes';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [MatSidenavModule, RouterOutlet],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {
  protected readonly ERoutesConstans = ERouteConstans;
}
