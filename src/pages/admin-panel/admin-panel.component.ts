import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface ChartData {
  labels: string[];
  data: number[];
}

interface OfficeLoadData {
  labels: string[];
  data: number[];
  colors: string[];
}

interface Order {
  name: string;
  amount: number;
}

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatGridListModule
  ],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements AfterViewInit {
  @ViewChild('clientsCanvas') clientsCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('earningsCanvas') earningsCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('officeLoadCanvas') officeLoadCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('newClientsCanvas') newClientsCanvas!: ElementRef<HTMLCanvasElement>;

  selectedPeriod: string = 'clientsWeek';
  showOrders: boolean = false;
  averageCheck: number = 1500;
  
  orders: Order[] = [
    { name: 'Иванов Иван', amount: 1200 },
    { name: 'Петров Петр', amount: 1800 },
    { name: 'Сидоров Сидор', amount: 1500 },
    { name: 'Алексеев Алексей', amount: 2000 },
    { name: 'Кузнецов Кузя', amount: 1300 },
    { name: 'Смирнов Смирн', amount: 1600 }
  ];

  get visibleOrders(): Order[] {
    return this.showOrders ? this.orders : this.orders.slice(0, 3);
  }

  ngAfterViewInit(): void {
    this.createClientsChart();
    this.createEarningsChart();
    this.createOfficeLoadChart();
    this.createNewClientsChart();
  }

  createClientsChart(): void {
    const data = {
      labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      datasets: [{
        label: 'Количество записей',
        data: [120, 150, 130, 180, 200, 100, 80],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    };

    new Chart(this.clientsCanvas.nativeElement, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  createEarningsChart(): void {
    const data = {
      labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      datasets: [{
        label: 'Заработок (₽)',
        data: [1500, 1800, 1600, 2200, 2500, 1200, 900],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      }]
    };

    new Chart(this.earningsCanvas.nativeElement, {
      type: 'line',
      data: data,
      options: {
        responsive: true
      }
    });
  }

  createOfficeLoadChart(): void {
    const data = {
      labels: ['Офис 1', 'Офис 2', 'Офис 3'],
      datasets: [{
        data: [60, 80, 40],
        backgroundColor: ['#FF6384', '#FFCE56', '#36A2EB'],
        borderWidth: 1
      }]
    };

    new Chart(this.officeLoadCanvas.nativeElement, {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  createNewClientsChart(): void {
    const data = {
      labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      datasets: [{
        label: 'Новые клиенты',
        data: [50, 60, 45, 70, 80, 30, 20],
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      }]
    };

    new Chart(this.newClientsCanvas.nativeElement, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  onPeriodChange(period: string): void {
    this.selectedPeriod = period;
  }

  toggleOrders(): void {
    this.showOrders = !this.showOrders;
  }
}