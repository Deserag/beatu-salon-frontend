import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface Order {
  name: string;
  amount: number;
}

interface SelectedPeriods {
  officeLoad: string;
  clients: string;
  earnings: string;
  averageCheck: string;
  newClients: string;
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

  selectedPeriods: SelectedPeriods = {
    officeLoad: 'week',
    clients: 'week',
    earnings: 'week',
    averageCheck: 'week',
    newClients: 'week'
  };
  
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
    const data = this.getChartData('clients', this.selectedPeriods.clients);
    
    new Chart(this.clientsCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Количество записей',
          data: data.values,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
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
    const data = this.getChartData('earnings', this.selectedPeriods.earnings);
    
    new Chart(this.earningsCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Заработок (₽)',
          data: data.values,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2,
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true
      }
    });
  }

  createOfficeLoadChart(): void {
    const data = this.getChartData('officeLoad', this.selectedPeriods.officeLoad);
    
    new Chart(this.officeLoadCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.values,
          backgroundColor: ['#FF6384', '#FFCE56', '#36A2EB'],
          borderWidth: 1
        }]
      },
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
    const data = this.getChartData('newClients', this.selectedPeriods.newClients);
    
    new Chart(this.newClientsCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Новые клиенты',
          data: data.values,
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }]
      },
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

  onPeriodChange(period: string, chartType: keyof SelectedPeriods): void {
    this.selectedPeriods[chartType] = period;
    this.updateChartData(chartType);
  }

  private updateChartData(chartType: keyof SelectedPeriods): void {
    const data = this.getChartData(chartType, this.selectedPeriods[chartType]);
    
    switch(chartType) {
      case 'clients':
        this.updateChart(this.clientsCanvas, 'bar', 'Количество записей', data);
        break;
      case 'earnings':
        this.updateChart(this.earningsCanvas, 'line', 'Заработок (₽)', data);
        break;
      case 'officeLoad':
        this.updateChart(this.officeLoadCanvas, 'doughnut', '', data);
        break;
      case 'newClients':
        this.updateChart(this.newClientsCanvas, 'bar', 'Новые клиенты', data);
        break;
    }
  }

  private updateChart(
    canvasRef: ElementRef<HTMLCanvasElement>, 
    type: any, 
    label: string, 
    data: { labels: string[], values: number[] }
  ): void {
    const chart = Chart.getChart(canvasRef.nativeElement);
    if (chart) {
      chart.data.labels = data.labels;
      chart.data.datasets[0].data = data.values;
      chart.data.datasets[0].label = label;
      chart.update();
    }
  }

  private getChartData(chartType: string, period: string): { labels: string[], values: number[] } {
    switch(period) {
      case 'today':
        return {
          labels: ['Утро', 'День', 'Вечер'],
          values: this.generateRandomData(3, chartType)
        };
      case 'week':
        return {
          labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
          values: this.generateRandomData(7, chartType)
        };
      case 'month':
        return {
          labels: ['Неделя 1', 'Неделя 2', 'Неделя 3', 'Неделя 4'],
          values: this.generateRandomData(4, chartType)
        };
      case 'year':
        return {
          labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
          values: this.generateRandomData(12, chartType)
        };
      default:
        return {
          labels: [],
          values: []
        };
    }
  }

  private generateRandomData(count: number, chartType: string): number[] {
    // Генерация тестовых данных
    const base = chartType === 'earnings' ? 1000 : 
                chartType === 'averageCheck' ? 500 : 10;
    const multiplier = chartType === 'earnings' ? 10 : 
                      chartType === 'averageCheck' ? 5 : 1;
    
    return Array(count).fill(0).map(() => 
      Math.floor(base + Math.random() * base * multiplier)
    );
  }

  toggleOrders(): void {
    this.showOrders = !this.showOrders;
  }
}