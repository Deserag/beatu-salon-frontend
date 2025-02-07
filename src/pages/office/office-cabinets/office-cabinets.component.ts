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

@Component({
  selector: 'app-office-cabinets',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, CommonModule],
  templateUrl: './office-cabinets.component.html',
  styleUrl: './office-cabinets.component.scss'
})
export class OfficeCabinetsComponent {
protected readonly ERoutesConstans = ERouteConstans;

displayedColumns:  string[] = [
  'number',
  'adress',
  'NumberOffice'
]
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
        // this.totalCount$.next(response.infoPage.totalCount);
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
      // const dialogRef = this._dialog.open(User)
    }
    onCLickUpdateCabinet(office: ICabinet){

    }

    onClickDeleteCabinet(office: ICabinet){
      
    }
}
