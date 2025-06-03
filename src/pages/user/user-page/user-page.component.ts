import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { switchMap, tap, of } from 'rxjs';
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

  private readonly _userApiService = inject(UserApiService);
  private readonly _route = inject(ActivatedRoute);
  private readonly _destroyRef = inject(DestroyRef);

  private _getUserId(): string | null {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user?.id || null;
    } catch {
      return null;
    }
  }

  constructor() {
    const userIdFromStorage = this._getUserId();

    this._route.paramMap
      .pipe(
        switchMap((params) => {
          const userId = params.get('id') || userIdFromStorage;
          if (!userId) {
            return of(null);
          }
          return this._userApiService.getUserInfo(userId);
        }),
        tap((response) => {
          if (response) {
            this.user = response;
          }
        }),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe();
  }

  onEdit() {
    console.log('Edit clicked');
  }

  isWorkingDay(date: Date): boolean {
    const day = date.getDay();
    return day >= 1 && day <= 5;
  }

  getWorkHours(): string {
    return '10:00 - 19:00';
  }

  dateClass = (date: Date) =>
    this.isWorkingDay(date) ? 'working-day' : 'non-working-day';
}
