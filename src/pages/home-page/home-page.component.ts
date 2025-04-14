import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Chart, registerables } from 'chart.js';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';

Chart.register(...registerables);

interface RevenueData {
  today: number;
  week: number;
}

interface Birthday {
  name: string;
  date: string;
  type: 'employee' | 'client';
}

interface OfficeLoad {
  name: string;
  occupiedSlots: number;
  totalSlots: number;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatIconModule, MatGridListModule, MatExpansionModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  revenue: RevenueData = { today: 0, week: 0 };
  employeeBirthdays: Birthday[] = [];
  clientBirthdays: Birthday[] = [];
  servicePopularityChart: Chart | null = null;
  newClientsChart: Chart | null = null;
  officeLoadChart: Chart | null = null;
  officeLoad: OfficeLoad[] = [];

  ngOnInit(): void {
    this.loadHomePageData();
    this.initializeCharts();
    this.loadOfficeLoad();
  }

  private loadHomePageData(): void {
    this.revenue = {
      today: 437,
      week: 3089,
    };

    this.employeeBirthdays = [
      { name: 'Анна', date: '15.04', type: 'employee' },
      { name: 'Петр', date: '20.04', type: 'employee' },
    ];

    this.clientBirthdays = [
      { name: 'Иван', date: '18.04', type: 'client' },
      { name: 'Елена', date: '25.04', type: 'client' },
    ];
  }

  private initializeCharts(): void {
    this.createServicePopularityChart();
    this.createNewClientsChart();
  }

  private createServicePopularityChart(): void {
    const serviceLabels = ['Строка', 'Подпись', 'Организацию', 'Указ за марш'];
    const serviceData = [35, 25, 20, 20];

    this.servicePopularityChart = new Chart('servicePopularityChart', {
      type: 'doughnut',
      data: {
        labels: serviceLabels,
        datasets: [{
          data: serviceData,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
          ],
        }],
      },
    });
  }

  private createNewClientsChart(): void {
    const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const newClientsData = [5, 7, 3, 8, 6, 9, 4];

    this.newClientsChart = new Chart('newClientsChart', {
      type: 'line',
      data: {
        labels: daysOfWeek,
        datasets: [{
          label: 'Новые клиенты',
          data: newClientsData,
          borderColor: '#673ab7',
          backgroundColor: 'rgba(103, 58, 183, 0.1)',
          borderWidth: 2,
          fill: true,
        }],
      },
    });
  }

  private loadOfficeLoad(): void {
    this.officeLoad = [
      { name: 'Кабинет 1', occupiedSlots: 3, totalSlots: 5 },
      { name: 'Кабинет 2', occupiedSlots: 5, totalSlots: 7 },
      { name: 'Кабинет 3', occupiedSlots: 2, totalSlots: 3 },
    ];

    this.createOfficeLoadChart();
  }

  private createOfficeLoadChart(): void {
    const labels = this.officeLoad.map(office => office.name);
    const data = this.officeLoad.map(office => (office.occupiedSlots / office.totalSlots) * 100);

    this.officeLoadChart = new Chart('officeLoadChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Занятость (%)',
          data: data,
          backgroundColor: data.map(p => 
            p < 50 ? '#4CAF50' : p < 80 ? '#FFC107' : '#F44336'
          ),
        }],
      },
      options: {
        scales: {
          y: {
            max: 100,
          },
        },
      },
    });
  }
}