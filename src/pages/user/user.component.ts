import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IUser, UserApiService } from '@entity';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatTableDataSource],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  users: IUser[] = [];
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'actions'];
  dataSource = new MatTableDataSource<IUser>(this.users);

  constructor(private userApiService: UserApiService) {
    this.loadUsers();
  }

  loadUsers() {
    this.userApiService.getUser().subscribe(
      (response) => {
        this.users = response.users;
        this.dataSource.data = this.users;
      },
      (error) => console.error('Ошибка загрузки данных', error)
    );
  }

  createUser() {
    console.log('Создание нового пользователя');
  }

  editUser(user: IUser) {
    console.log('Редактирование пользователя', user);
  }

  deleteUser(user: IUser) {
    console.log('Удаление пользователя', user);
  }

  navigateTo(route: string) {
    console.log('Навигация', route);
  }
}
