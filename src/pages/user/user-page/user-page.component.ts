import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Chart, ChartType } from 'chart.js';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,  
    MatNativeDateModule, 
    MatInputModule
  ],
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent {
  user = {
    firstName: 'Иван',
    lastName: 'Иванов',
    middleName: 'Иванович',
    birthDate: 'Jun 15, 1990',
    email: 'ivanov@example.com',
    login: 'ivanov123',
    department: 'Отдел разработки',
    role: 'Разработчик',
    createdAt: 'Dec 16, 2024',
    updatedAt: 'Dec 16, 2024',
    directions: ['Проект A', 'Проект B', 'Проект C']
  };

  salaryData = Array.from({ length: 30 }, (_, i) => ({
    day: `${1000 + Math.random() * 500}`.slice(0, 4) + ' руб.',
    week: `${7000 + Math.random() * 1000}`.slice(0, 4) + ' руб.',
    month: `${30000 + Math.random() * 1000}`.slice(0, 4) + ' руб.'
  }));

  displayedColumns = ['day', 'week', 'month'];

  salaryChart: any;

  constructor() {
    const salaryAmounts = this.salaryData.map(data => ({
      day: parseInt(data.day.replace(' руб.', '').replace(' ', ''), 10),
      week: parseInt(data.week.replace(' руб.', '').replace(' ', ''), 10),
      month: parseInt(data.month.replace(' руб.', '').replace(' ', ''), 10),
    }));

    const labels = Array.from({ length: 30 }, (_, i) => `День ${i + 1}`);
    const data = {
      labels: labels,
      datasets: [{
        label: 'Заработок за день',
        data: salaryAmounts.map(item => item.day), 
        backgroundColor: '#8db662',
        borderColor: '#8db662',
        borderWidth: 1
      }]
    };

    const config = {
      type: 'bar' as ChartType,
      data: data,
      options: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        }
      }
    };

    this.salaryChart = new Chart('salaryChart', config);
  }

  onEdit() {
    console.log('Edit clicked');
  }
}
