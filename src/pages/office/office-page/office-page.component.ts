import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { IOffice, OfficeApiService, TResGetOffice } from '@entity';
import { ERouteConstans } from '@routes';
import { BehaviorSubject, combineLatestWith, switchMap } from 'rxjs';
import { OfficeWindowComponent } from 'src/widgets/office/office-window/office-window.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-office-page',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './office-page.component.html',
  styleUrl: './office-page.component.scss',
})
export class OfficePageComponent {
  protected readonly ERoutesConstans = ERouteConstans;
  displayedColumns: string[] = ['number', 'adress', 'actions'];
  dataSource$ = new BehaviorSubject<IOffice[]>([]);
  totalCount$ = new BehaviorSubject<number>(0);
  private _page$ = new BehaviorSubject<number>(1);
  private _pageSize$ = new BehaviorSubject<number>(10);
  private _officeApiService = inject(OfficeApiService);
  private _dialog = inject(MatDialog);
  private _destroyRef = inject(DestroyRef);

  constructor() {
    this._page$
      .pipe(
        combineLatestWith(this._pageSize$),
        switchMap(([page, pageSize]) =>
          this._officeApiService.getOffice({ page, pageSize })
        ),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((response: TResGetOffice) => {
        this.dataSource$.next(response.rows);
        this.totalCount$.next(response.infoPage?.totalCount || 0);
      });

    this._destroyRef.onDestroy(() => {
      this._page$.complete();
      this._pageSize$.complete();
      this.dataSource$.complete();
      this.totalCount$.complete();
    });
  }

  onPageChange(event: PageEvent): void {
    this._pageSize$.next(event.pageSize);
    this._page$.next(event.pageIndex + 1);
  }

  onClickCreateOffice() {
    const dialogRef = this._dialog.open(OfficeWindowComponent, {
      width: '600px',
      data: null,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._page$.next(1);
      }
    });
  }

  onCLickUpdateOffice(office: IOffice) {
    const dialogRef = this._dialog.open(OfficeWindowComponent, {
      width: '600px',
      data: office,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._page$.next(this._page$.value);
      }
    });
  }

  onClickDeleteOffice(office: IOffice) {
    if (confirm(`Вы уверены, что хотите удалить офис №${office.number}?`)) {
      this._officeApiService.deleteOffice({ id: office.id, creatorId: '' }).subscribe({
        next: (response) => {
          console.log('Офис удален:', response);
          this._page$.next(this._page$.value);
        },
        error: (error) => {
          console.error('Ошибка при удалении офиса:', error);
        },
      });
    }
  }
}