import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { IUser, UserApiService } from '@entity';
import { MatDialog } from '@angular/material/dialog';
import { UserWindowComponent } from 'src/widgets/user-window/user-window.component';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatSortModule,
    MatPaginatorModule,
],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  users: IUser[] = [];
  totalCount$ = new BehaviorSubject<number>(0);
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'actions'];
  _dataSource = new MatTableDataSource<IUser>(this.users);
  private _page$ = new BehaviorSubject<number>(1);
  private _pageSize$ = new BehaviorSubject<number>(10);

  constructor(private _userApiService: UserApiService,private _dialog: MatDialog ) {
    this.#loadUsers();
  }

  #loadUsers() {
    this._userApiService.getUser().subscribe(
      (response) => {
        this.users = response.users;
        this._dataSource.data = this.users;
      },
      (error) => console.error('Ошибка загрузки данных', error)
    );
  }

  createUser() {
    const dialogRef = this._dialog.open(UserWindowComponent);
    dialogRef.componentInstance.user.subscribe((newUser: IUser) => {
      console.log('Создан пользователь:', newUser);
      this.#loadUsers();
    });
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

  onPageChange(event: PageEvent): void {
    this._pageSize$.next(event.pageSize);
    this._page$.next(event.pageIndex + 1);
}
}
