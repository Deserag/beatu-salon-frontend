import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ERouteConstans } from '@routes';

@Component({
  selector: 'app-office',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './office.component.html',
  styleUrl: './office.component.scss'
})
export class OfficeComponent {
protected readonly ERoutesConstans = ERouteConstans;
}
