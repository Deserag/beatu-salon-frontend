import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Chart, ChartType } from 'chart.js';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { BehaviorSubject, combineLatestWith, switchMap } from 'rxjs';
import { IUser, TResGetUsers, UserApiService, IGetUser } from '@entity';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
  ],
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent {
  user: IGetUser | null = null;
  dataSource$ = new BehaviorSubject<IUser[]>([]);
  totalCount$ = new BehaviorSubject<number>(0);
  private _page$ = new BehaviorSubject<number>(1);
  private _pageSize$ = new BehaviorSubject<number>(10);
  private readonly _userApiService = inject(UserApiService);
  private readonly _dialog = inject(MatDialog);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _route = inject(ActivatedRoute);

  constructor() {
    this._route.paramMap
      .pipe(
        switchMap((params) => {
          const userId = params.get('id');
          if (userId) {
            return this._userApiService.getUserInfo(userId);  
          }
          throw new Error('User ID is required');
        }),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((response: IGetUser) => {
        this.user = response;
        this.#loadUser();
        this.#loadUserSalary();
      });

    this._destroyRef.onDestroy(() => {
      this._page$.complete();
      this._pageSize$.complete();
      this.dataSource$.complete();
      this.totalCount$.complete();
    });
  }

  #loadUser() {
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
        // this.totalCount$.next(response.infoPage.totalCount);
      });
  }

  #loadUserSalary() {
    // Тот же код для загрузки зарплаты
  }

  onEdit() {
    console.log('Edit clicked');
  }

  isWorkingDay(date: Date): boolean {
    const day = date.getDay();
    return [1, 2, 3, 4, 5].includes(day);  // Пн-Пт
  }

  getWorkHours(): string {
    return '10:00 - 19:00';  // Рабочие часы
  }

  dateClass = (date: Date) => {
    return this.isWorkingDay(date) ? 'working-day' : 'non-working-day';
  };
}

