import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ICabinet, OfficeApiService, TResGetCabinet } from '@entity';
import { ERouteConstans } from '@routes';
import { BehaviorSubject, combineLatestWith, switchMap } from 'rxjs';
import { CabinetWindowComponent } from 'src/widgets/office/cabinet-window/cabinet-window.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-office-cabinets',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './office-cabinets.component.html',
  styleUrl: './office-cabinets.component.scss',
})
export class OfficeCabinetsComponent {
  protected readonly ERoutesConstans = ERouteConstans;
  displayedColumns: string[] = ['number', 'numberOffice','adress', 'actions'];
  dataSource$ = new BehaviorSubject<ICabinet[]>([]);
  totalCount$ = new BehaviorSubject<number>(0);
  private _page$ = new BehaviorSubject<number>(1);
  private _pageSize$ = new BehaviorSubject<number>(10);
  private _cabinetApiService = inject(OfficeApiService);
  private _dialog = inject(MatDialog);
  private _destroyRef = inject(DestroyRef);

  constructor() {
    this._page$
      .pipe(
        combineLatestWith(this._pageSize$),
        switchMap(([page, pageSize]) =>
          this._cabinetApiService.getCabinets({ page, pageSize })
        ),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((response: TResGetCabinet) => {
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

  onClickCreateCabinet() {
    const dialogRef = this._dialog.open(CabinetWindowComponent, {
      width: '600px',
      data: null,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._page$.next(1);
      }
    });
  }

  onCLickUpdateCabinet(cabinet: ICabinet) {
    const dialogRef = this._dialog.open(CabinetWindowComponent, {
      width: '600px',
      data: cabinet,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._page$.next(this._page$.value);
      }
    });
  }

  private _getCreatorId(): string | null {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user?.id || null;
    } catch {
      return null;
    }
  }
  

  onClickDeleteCabinet(cabinet: ICabinet) {
    const creatorId = this._getCreatorId();
    if (!creatorId) {
      console.error('Не удалось получить creatorId из localStorage');
      return;
    }
  
    if (confirm(`Вы уверены, что хотите удалить кабинет №${cabinet.number}?`)) {
      this._cabinetApiService.deleteCabinet({ id: cabinet.id, creatorId }).subscribe({
        next: (response) => {
          console.log('Кабинет удален:', response);
          this._page$.next(this._page$.value);
        },
        error: (error) => {
          console.error('Ошибка при удалении кабинета:', error);
        },
      });
    }
  }
  
}