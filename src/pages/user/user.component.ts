import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IUser, UserApiService } from '@entity';
import { IGetUser } from '@entity';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  users: IUser[] = [];
  totalUsers: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  nameFilter: string = '';

  constructor(private userApiService: UserApiService) {
    this.userApiService.getUser().subscribe((response: IGetUser) => {
      this.users = response.users;
    });
  }
  loadUsers() {
    this.userApiService.getUser(this.nameFilter, this.currentPage, this.pageSize).subscribe(
      (response: IGetUser) => {
        this.users = response.users;
        this.totalUsers = response.totalCount;
        this.totalPages = response.totalPages;
      },
      (error) => {
        console.error('Ошибка при загрузке пользователей', error);
      }
    );
  }
  onFilterChange() {
    this.currentPage = 1; 
    this.loadUsers();
  }
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadUsers();
  }
}
