import { Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { IUserDepartment, TResGetDepartment, UserApiService } from '@entity';
import { BehaviorSubject, combineLatestWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-user-department',
  standalone: true,
  imports: [],
  templateUrl: './user-department.component.html',
  styleUrl: './user-department.component.scss'
})
export class UserDepartmentComponent {
private _page$ = new BehaviorSubject<number>(1);
  private _pageSize$ = new BehaviorSubject<number>(10);
  dataSource$ = new BehaviorSubject<IUserDepartment[]>([]);
  private _pages$ = new BehaviorSubject<number>(1);
  totalCount$ = new BehaviorSubject<number>(0);

  constructor(
    private _departmentApiService: UserApiService,
        private _dialog: MatDialog,
        private _destroyRef: DestroyRef
  )
  {
      this._page$
        .pipe(
          combineLatestWith(this._pageSize$),
          switchMap(([page, pageSize]) =>
            this._departmentApiService.getUserDepartment({ page, pageSize })
          ),
          takeUntilDestroyed(this._destroyRef)
        )
        .subscribe((response: TResGetDepartment) => {
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
}
