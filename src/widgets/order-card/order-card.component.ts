import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.scss',
})
export class OrderCardComponent {
  @Input() fullName: string = '';
  @Input() master: string = '';
  @Input() service: string = '';
  @Input() price: number = 0;
  @Input() dateTime: Date = new Date();
  @Input() office: string = '';
}