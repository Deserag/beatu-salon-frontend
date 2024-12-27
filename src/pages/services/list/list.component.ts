import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { IServices, ServicesApiService, TResGetService } from '@entity';
import { ERouteConstans } from '@routes';
import { BehaviorSubject, combineLatestWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  protected readonly ERoutesConstans = ERouteConstans;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource$ = new BehaviorSubject<IServices[]>([]);
  totalCount$ = new BehaviorSubject<number>(0);
  private _page$ = new BehaviorSubject<number>(1);
  private _pageSize$ = new BehaviorSubject<number>(10);
  private _serviceApiService = inject(ServicesApiService);
  private _dialog = inject(MatDialog);
  private _destroyRef = inject(DestroyRef);
  private _router = inject(Router);

  constructor() {
    this._page$
      .pipe(
        combineLatestWith(this._pageSize$),
        switchMap(([page, pageSize]) =>
          this._serviceApiService.getService({ page, pageSize })
        ),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((response: TResGetService) => {
        this.dataSource$.next(response.rows);
      });

    this._destroyRef.onDestroy(() => {
      this._page$.complete();
      this._pageSize$.complete();
      this.dataSource$.complete();
      this.totalCount$.complete();
    });
  }
}
