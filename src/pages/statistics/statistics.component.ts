import { Component } from '@angular/core';
import { OrderCardComponent } from 'src/widgets/order-card/order-card.component';
import { DatePipe, NgFor } from '@angular/common'; // Импортируем DatePipe

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [OrderCardComponent, NgFor], 
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent {
  orders = [
    {
      fullName: 'Иванов Иван Иванович',
      master: 'Петров Петр Петрович',
      service: 'Стрижка',
      price: 1500,
      dateTime: '2024-03-15',
      office: 'Офис 1'
    },
    {
      fullName: 'Сидоров Сидор Сидорович',
      master: 'Петров Петр Петрович',
      service: 'Маникюр',
      price: 1000,
      dateTime: '2024-03-16T12:00:00',
      office: 'Офис 2'
    }
  ];
}