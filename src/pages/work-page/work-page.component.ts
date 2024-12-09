import { Component } from '@angular/core';
import { HeaderComponent } from "../../widgets/header/header.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-work-page',
  standalone: true,
  imports: [HeaderComponent,RouterOutlet],
  templateUrl: './work-page.component.html',
  styleUrl: './work-page.component.scss'
})
export class WorkPageComponent {

}
