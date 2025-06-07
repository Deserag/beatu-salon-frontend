import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [DatePipe, MatCardModule],
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss']
})
export class OrderCardComponent {
  @Input() fullName: string = '';
  @Input() master: string = '';
  @Input() service: string = '';
  @Input() price: number = 0;
  @Input() dateTime: string = '';
  @Input() office: string = '';
}