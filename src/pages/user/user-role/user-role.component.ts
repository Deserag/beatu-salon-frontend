import { CommonModule } from '@angular/common';
import { Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { IGetRole, IUserRole, TResGetRoles, UserApiService } from '@entity';
import { BehaviorSubject, combineLatestWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-user-role',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, CommonModule],
  templateUrl: './user-role.component.html',
  styleUrl: './user-role.component.scss'
})
export class UserRoleComponent {
  displayedColumns: string[] = ['Name', 'Description','Employees', 'Actions'];
  private _page$ = new BehaviorSubject<number>(1);
  private _pageSize$ = new BehaviorSubject<number>(10);
  dataSource$ = new BehaviorSubject<IUserRole[]>([]);
  private _pages$ = new BehaviorSubject<number>(1);
  totalCount$ = new BehaviorSubject<number>(0);

  constructor (
    private _roleApiService: UserApiService,
    private _dialog: MatDialog,
    private _destroyRef: DestroyRef
  ) {
    this._page$
      .pipe(
        combineLatestWith(this._pageSize$),
        switchMap(([page, pageSize]) =>
          this._roleApiService.getUserRole({ page, pageSize })
        ),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((response: TResGetRoles) => {
        this.dataSource$.next(response.rows);
        this.totalCount$.next(response.infoPage.totalCount);
      });

      this._destroyRef.onDestroy(() => {
        this._page$.complete();
        this._pageSize$.complete();
        this.dataSource$.complete();
        this.totalCount$.complete();
    });
  }

    createRole() {
      // const dialogRef = this._dialog.open(UserWindowComponent);
      // dialogRef.componentInstance.user.subscribe((newUser: IUser) => {
      //   console.log('Создан пользователь:', newUser);
      //   this._page$.next(this._page$.value);
      // });
    }
  
    editRole(user: IUserRole): void {
      console.log('Редактирование пользователя', user);
    }
  
    deleteRole(user: IUserRole): void {
      console.log('Удаление пользователя', user);
    }

    onPageChange(event: PageEvent): void {
        this._pageSize$.next(event.pageSize);
        this._page$.next(event.pageIndex + 1);
      }
}