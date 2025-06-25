import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Chart, registerables } from 'chart.js';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { RecordApiService, UserApiService, ClientApiService } from '@entity';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatGridListModule,
    MatExpansionModule,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit, OnDestroy {
  revenue: RevenueData = { today: 0, week: 0 };
  employeeBirthdays: Birthday[] = [];
  clientBirthdays: Birthday[] = [];
  officeLoad: OfficeLoad[] = [];

  servicePopularityChart: Chart | null = null;
  newClientsChart: Chart | null = null;
  officeLoadChart: Chart | null = null;

  private recordApi = inject(RecordApiService);
  private userApi = inject(UserApiService);
  private clientApi = inject(ClientApiService);
  private _destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadBirthdays();
    this.loadDataFromApi();
    this.loadNewClientsChart();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private loadBirthdays(): void {
    this.userApi
      .getUser({ page: 1, pageSize: 10 })
      .pipe(takeUntil(this._destroy$))
      .subscribe((res) => {
        const filtered = res.rows
          .filter((u) => u.birthDate)
          .map((u) => ({
            name: `${u.firstName} ${u.lastName}`.trim(),
            date: new Date(u.birthDate).toLocaleDateString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
            }),
            type: 'employee' as const,
          }));
        this.employeeBirthdays = filtered.slice(0, 3);
      });

    this.clientApi
      .getClients({ page: 1, pageSize: 10 })
      .pipe(takeUntil(this._destroy$))
      .subscribe((res) => {
        const filtered = res.rows
          .filter((c) => c.birthDate)
          .map((c) => ({
            name: `${c.firstName} ${c.lastName}`.trim(),
            date: new Date(c.birthDate).toLocaleDateString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
            }),
            type: 'client' as const,
          }));
        this.clientBirthdays = filtered.slice(0, 3);
      });
  }

  private loadNewClientsChart(): void {
    this.clientApi
      .getClients({ page: 1, pageSize: 1000 })
      .pipe(takeUntil(this._destroy$))
      .subscribe((res) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        const counts = [0, 0, 0, 0, 0, 0, 0];

        res.rows.forEach((c) => {
          if (c.createdAt) {
            const createdDate = new Date(c.createdAt);
            const createdDay = new Date(createdDate);
            createdDay.setHours(0, 0, 0, 0);

            const diffDays = Math.floor(
              (today.getTime() - createdDay.getTime()) / (1000 * 60 * 60 * 24)
            );
            if (diffDays >= 0 && diffDays <= 6) {
              const dayIndex = (createdDate.getDay() + 6) % 7;
              counts[dayIndex]++;
            }
          }
        });

        if (this.newClientsChart) {
          this.newClientsChart.destroy();
        }

        this.newClientsChart = new Chart('newClientsChart', {
          type: 'line',
          data: {
            labels: weekDays,
            datasets: [
              {
                label: 'Новые клиенты',
                data: counts,
                borderColor: '#673ab7',
                backgroundColor: 'rgba(103, 58, 183, 0.1)',
                borderWidth: 2,
                fill: true,
              },
            ],
          },
        });
      });
  }

  private loadDataFromApi(): void {
    this.recordApi.getRecords({ page: 1, size: 10 }).subscribe({
      next: (res) => {
        const today = new Date();
        this.revenue.today = res.rows.reduce((sum, rec) => {
          const recDate = new Date(rec.dateTime);
          if (
            recDate.getDate() === today.getDate() &&
            recDate.getMonth() === today.getMonth() &&
            recDate.getFullYear() === today.getFullYear()
          ) {
            return sum + (rec.service?.price ?? 0);
          }
          return sum;
        }, 0);

        const now = today.getTime();
        this.revenue.week = res.rows.reduce((sum, rec) => {
          const recDate = new Date(rec.dateTime);
          const diff = now - recDate.getTime();
          if (diff >= 0 && diff <= 7 * 24 * 60 * 60 * 1000) {
            return sum + (rec.service?.price ?? 0);
          }
          return sum;
        }, 0);

        this.initializeCharts();
      },
      error: (err) => {
        console.error('Ошибка загрузки данных для домашней страницы:', err);
      },
    });
  }

  private initializeCharts(): void {
    this.createServicePopularityChart();
    this.createOfficeLoadChart();
  }

  private createServicePopularityChart(): void {
    const serviceLabels = [
      'Стрижка мужская',
      'Стрижка женская',
      'Маникюр',
      'Педикюр',
    ];
    const serviceData = [2, 1, 1, 2];

    if (this.servicePopularityChart) {
      this.servicePopularityChart.destroy();
    }

    this.servicePopularityChart = new Chart('servicePopularityChart', {
      type: 'doughnut',
      data: {
        labels: serviceLabels,
        datasets: [
          {
            data: serviceData,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          },
        ],
      },
    });
  }

  private createOfficeLoadChart(): void {
    const labels = this.officeLoad.map((office) => office.name);
    const data = this.officeLoad.map(
      (office) => (office.occupiedSlots / office.totalSlots) * 100
    );

    if (this.officeLoadChart) {
      this.officeLoadChart.destroy();
    }

    this.officeLoadChart = new Chart('officeLoadChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Занятость (%)',
            data: data,
            backgroundColor: data.map((p) =>
              p < 50 ? '#4CAF50' : p < 80 ? '#FFC107' : '#F44336'
            ),
          },
        ],
      },
      options: {
        scales: {
          y: { max: 100 },
        },
      },
    });
  }
}
