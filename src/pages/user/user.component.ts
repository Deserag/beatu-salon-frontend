import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ERouteConstans } from '@routes';

@Component({
    selector: 'app-user',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent {
  protected readonly ERoutesConstans = ERouteConstans;
}

