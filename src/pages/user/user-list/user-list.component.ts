import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {
  BehaviorSubject,
  combineLatest,
  combineLatestWith,
  switchMap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IUser, TResGetUsers, UserApiService } from '@entity';
import { UserWindowComponent } from 'src/widgets/user/user-window/user-window.component';
import { ERouteConstans } from '@routes';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
  protected readonly ERoutesConstans = ERouteConstans;
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'middleName',
    'birthDate',
    'email',
    'actions',
  ];
  dataSource$ = new BehaviorSubject<IUser[]>([]);
  totalCount$ = new BehaviorSubject<number>(0);
  private _page$ = new BehaviorSubject<number>(1);
  private _pageSize$ = new BehaviorSubject<number>(10);
  private _userApiService = inject(UserApiService);
  private _dialog = inject(MatDialog);
  private _destroyRef = inject(DestroyRef);
  private creatorId: string;
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
        this.dataSource$.next(response.rows);
      });
    this._destroyRef.onDestroy(() => {
      this._page$.complete();
      this._pageSize$.complete();
      this.dataSource$.complete();
      this.totalCount$.complete();
    });

    this.creatorId = (() => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user?.id || '';
      } catch {
        return '';
      }
    })();
  }

  onPageChange(event: PageEvent): void {
    this._pageSize$.next(event.pageSize);
    this._page$.next(event.pageIndex + 1);
  }

  createUser() {
    const dialogRef = this._dialog.open(UserWindowComponent);
    dialogRef.componentInstance.user.subscribe((newUser: IUser) => {
      console.log('Создан пользователь:', newUser);
      this._page$.next(this._page$.value);
    });
  }

  editUser(user: IUser): void {
    const dialogRef = this._dialog.open(UserWindowComponent, {
      data: user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Обновлен пользователь:', result);
        this._page$.next(this._page$.value);
      }
    });
  }

  deleteUser(user: IUser): void {
    if (
      confirm(
        `Вы уверены, что хотите удалить пользователя ${user.firstName} ${user.lastName}?`
      )
    ) {
      const admin = JSON.parse(localStorage.getItem('user') || '{}');
      const adminId = admin?.id;

      if (!adminId) {
        console.error('Admin ID не найден в localStorage');
        return;
      }

      this._userApiService
        .deleteUser({ userId: user.id, adminId: this.creatorId }) 
        .subscribe({
          next: (response) => {
            console.log('Пользователь успешно удален', response);
            this._page$.next(this._page$.value);
          },
          error: (error) => {
            console.error('Ошибка удаления пользователя', error);
          },
        });
    }
  }
}
