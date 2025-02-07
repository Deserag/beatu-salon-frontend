import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { ERouteConstans } from '@routes';
import { AuthService } from '@entity';
interface Appointment {
  time: string;
  clientName: string;
  service: string;
  master: string;
}

interface Message {
  sender: string;
  text: string;
}

interface Employee {
  name: string;
  appointmentsCount: number;
  rating: number;
}

interface Review {
  clientName: string;
  text: string;
  rating: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    MatSidenavModule,  
    MatToolbarModule,  
    MatCardModule,    
    MatListModule,    
    MatIconModule,     
    MatButtonModule,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  protected readonly ERoutesConstans = ERouteConstans;
    readonly #authService = inject(AuthService);
    protected onClickLogOut(): void{
      this. #authService.logout();
    }
  
  userName = 'Имя пользователя';
  appointments: Appointment[] = [ /* ... */ ]; 
  clientsCount = 125;
  newClientsCount = 25;
  revenue = 18500;
  averageCheck = 1480;
  messages: Message[] = [ /* ... */ ]; // Оставим messages как есть

  employees: Employee[] = [
    { name: 'Елена', appointmentsCount: 32, rating: 4.8 },
    { name: 'Ольга', appointmentsCount: 28, rating: 4.5 },
    { name: 'Ирина', appointmentsCount: 40, rating: 4.9 },
    { name: 'Игорь', appointmentsCount: 15, rating: 4.2 },
  ];

  reviews: Review[] = [
    { clientName: 'Анна', text: 'Очень довольна работой мастера Елены! Профессионал своего дела.', rating: 5 },
    { clientName: 'Сергей', text: 'Спасибо Ольге за прекрасный маникюр! Все сделано аккуратно и быстро.', rating: 4 },
    { clientName: 'Виктория', text: 'Ирина - настоящий художник! Моя новая стрижка просто потрясающая.', rating: 5 },
  ];

  // Переменные для раскрывающихся виджетов
  appointmentsExpanded = false;
  employeesExpanded = false;
  reviewsExpanded = false;


  logout() {
    console.log('Выход из системы');
  }

  openAppointmentModal() {
    console.log('Открыть модальное окно');
  }
}