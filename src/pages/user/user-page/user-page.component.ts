import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Chart } from 'chart.js';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { BehaviorSubject, combineLatestWith, switchMap } from 'rxjs';
import {
  IUser,
  TResGetUsers,
  UserApiService,
  IGetUser,
  IUserEarnings,
} from '@entity';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserWindowComponent } from '@widgets';

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
  chart: Chart | null = null;

  constructor() {
    this._route.paramMap
      .pipe(
        switchMap((params) => {
          const userId = params.get('id');
          console.log(userId);
          if (userId) {
            this.#loadUserDepartments(userId);
            this.#loaduserEarnings(userId);
            return this._userApiService.getUserInfo(userId);
          }
          throw new Error('User ID is required');
        }),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((response: IGetUser) => {
        this.user = response;
        this.#loadUser();
        // this.#loadUserDepartments();
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
      });
  }

  #loadUserDepartments(departmentId: string) {
    this._userApiService
      .getUsersWithDepartment(departmentId)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (users: IUser[]) => {
          console.log('Users in department:', users);
          this.dataSource$.next(users);
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
  }

  #loaduserEarnings(userId: string) {
    this._userApiService
      .getUserEarnings(userId)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (earnings: IUserEarnings) => {
          if (this.chart) {
            this.chart.destroy();
          }

          const canvas = document.getElementById(
            'salaryChart'
          ) as HTMLCanvasElement;
          if (canvas) {
            this.chart = new Chart(canvas, {
              type: 'bar',
              data: {
                labels: earnings.earnings.map(
                  (item) => item.service?.name || 'Unknown'
                ),
                datasets: [
                  {
                    label: 'Заработок',
                    data: earnings.earnings.map(
                      (item) => item.service?.price || 0
                    ),
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                  },
                ],
              },
              options: {
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              },
            });
          }
        },
        error: (error) => {
          console.error('Error fetching earnings:', error);
        },
      });
  }

  onClickEditUser(user: IUser): void {
    const dialogRef = this._dialog.open(UserWindowComponent, { data: user });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Обновлен пользователь:', result);
        this.#loadUser();
      }
    });
  }

  isWorkingDay(date: Date): boolean {
    const day = date.getDay();
    return [1, 2, 3, 4, 5].includes(day);
  }

  getWorkHours(): string {
    return '10:00 - 19:00';
  }

  dateClass = (date: Date) =>
    this.isWorkingDay(date) ? 'working-day' : 'non-working-day';
}
