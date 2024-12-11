import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { BehaviorSubject, combineLatestWith, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IUser, TResGetUsers, UserApiService } from '@entity';
import { UserWindowComponent } from 'src/widgets/user-window/user-window.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'actions'];
  dataSource$ = new BehaviorSubject<IUser[]>([]);
  totalCount$ = new BehaviorSubject<number>(0);
  private _page$ = new BehaviorSubject<number>(1);
  private _pageSize$ = new BehaviorSubject<number>(10);
  private _userApiService = inject(UserApiService);
  private _dialog = inject(MatDialog);
  private _destroyRef = inject(DestroyRef);

  constructor() {
    this._page$
      .pipe(
        combineLatestWith(this._pageSize$),
        switchMap(([page, pageSize]) =>
          this._userApiService.getUser({ page, pageSize })
        ),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((response: TResGetUsers) => {
        this.dataSource$.next(response.rows || []);
        this.totalCount$.next(response.infoPage?.totalCount || 0);
      });
  }

  onPageChange(event: PageEvent): void {
    this._pageSize$.next(event.pageSize);
    this._page$.next(event.pageIndex + 1);
  }

  createUser() {
    const dialogRef = this._dialog.open(UserWindowComponent);
    dialogRef.componentInstance.user.subscribe((newUser: IUser) => {
      console.log('Создан пользователь:', newUser);
      // Обновление списка пользователей
      this._page$.next(this._page$.value);
    });
  }

  editUser(user: IUser): void {
    console.log('Редактирование пользователя', user);
  }

  deleteUser(user: IUser): void {
    console.log('Удаление пользователя', user);
  }
}
