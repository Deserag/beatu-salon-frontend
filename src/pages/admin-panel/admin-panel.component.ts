import { NgFor } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
  imports: [NgFor],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent implements AfterViewInit {
  @ViewChild('clientsCanvas') clientsCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('earningsCanvas') earningsCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('officeLoadCanvas') officeLoadCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('newClientsCanvas') newClientsCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('emptyCanvas') emptyCanvas!: ElementRef<HTMLCanvasElement>;

  selectedPeriod: string = 'week';
  showOrders: boolean = false;

  clientsChartData: ChartData = {
    labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    data: [120, 150, 130, 180, 200, 100, 80]
  };

  earningsChartData: ChartData = {
    labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    data: [1500, 1800, 1600, 2200, 2500, 1200, 900]
  };

  officeLoadChartData: OfficeLoadData = {
    labels: ['Офис 1', 'Офис 2', 'Офис 3'],
    data: [60, 80, 40],
    colors: ['lightcoral', 'gold', 'lightblue']
  };

  newClientsChartData: ChartData = {
    labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    data: [50, 60, 45, 70, 80, 30, 20]
  };

  averageCheck: number = 1500;
  orders: Order[] = [
    { name: 'Иванов Иван', amount: 1200 },
    { name: 'Петров Петр', amount: 1800 },
    { name: 'Сидоров Сидор', amount: 1500 },
    { name: 'Алексеев Алексей', amount: 2000 },
    { name: 'Кузнецов Кузя', amount: 1300 },
    { name: 'Смирнов Смирн', amount: 1600 }
  ];

  constructor() {
  }
  ngAfterViewInit(): void {
    this.drawClientsChart();
    this.drawEarningsChart();
    this.drawOfficeLoadChart();
    this.drawNewClientsChart();
  }

  drawClientsChart(): void {
    const canvas = this.clientsCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { labels, data } = this.clientsChartData;
    const barWidth = 30;
    const spacing = 20;
    const startX = 50;
    const startY = canvas.height - 50;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < data.length; i++) {
      const barHeight = data[i];
      const x = startX + i * (barWidth + spacing);
      const y = startY - barHeight;

      ctx.fillStyle = 'skyblue';
      ctx.fillRect(x, y, barWidth, barHeight);

      ctx.fillStyle = 'black';
      ctx.fillText(labels[i], x + barWidth / 2 - 10, startY + 20);
      ctx.fillText(data[i].toString(), x + barWidth / 2 - 10, y - 5);
    }
  }

  drawEarningsChart(): void {
    const canvas = this.earningsCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { labels, data } = this.earningsChartData;
    const startX = 50;
    const startY = canvas.height - 50;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(startX, startY - data[0]);
    for (let i = 1; i < data.length; i++) {
      ctx.lineTo(startX + i * 50, startY - data[i]);
    }
    ctx.strokeStyle = 'lightgreen';
    ctx.stroke();

    for (let i = 0; i < labels.length; i++) {
      ctx.fillStyle = 'black';
      ctx.fillText(labels[i], startX + i * 50 - 10, startY + 20);
      ctx.fillText(data[i].toString(), startX + i * 50 - 10, startY - data[i] - 5);
    }
  }

  drawOfficeLoadChart(): void {
    const canvas = this.officeLoadCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { labels, data, colors } = this.officeLoadChartData;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;
    let startAngle = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let total = data.reduce((a, b) => a + b, 0);

    for (let i = 0; i < data.length; i++) {
      const sliceAngle = (2 * Math.PI * data[i]) / total;
      ctx.fillStyle = colors[i];
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();

      startAngle += sliceAngle;

      const labelX = centerX + (radius + 20) * Math.cos(startAngle - sliceAngle / 2);
      const labelY = centerY + (radius + 20) * Math.sin(startAngle - sliceAngle / 2);

      ctx.fillStyle = 'black';
      ctx.fillText(labels[i], labelX, labelY);
      const percent = Math.round((data[i] / total) * 100);
      ctx.fillText(`${percent}%`, centerX + (radius / 2) * Math.cos(startAngle - sliceAngle / 2), centerY + (radius / 2) * Math.sin(startAngle - sliceAngle / 2));
    }
  }

  drawNewClientsChart(): void {
    const canvas = this.newClientsCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { labels, data } = this.newClientsChartData;
    const barWidth = 30;
    const spacing = 20;
    const startX = 50;
    const startY = canvas.height - 50;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < data.length; i++) {
      const barHeight = data[i];
      const x = startX + i * (barWidth + spacing);
      const y = startY - barHeight;

      ctx.fillStyle = 'lightgreen';
      ctx.fillRect(x, y, barWidth, barHeight);

      ctx.fillStyle = 'black';
      ctx.fillText(labels[i], x + barWidth / 2 - 10, startY + 20);
      ctx.fillText(data[i].toString(), x + barWidth / 2 - 10, y - 5);
    }
  }

  onPeriodChange(period: string): void {
    this.selectedPeriod = period;
    console.log('Выбран период:', period);
  }

  toggleOrders(): void {
    this.showOrders = !this.showOrders;
  }
}