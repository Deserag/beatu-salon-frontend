import { Component, DestroyRef, inject } from '@angular/core';
import { BehaviorSubject, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { RecordApiService, IRecord, TResGetRecord } from '@entity';
import { RecordsWindowComponent } from 'src/widgets/record/records-window/records-window.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrderCardComponent } from "../../widgets/order-card/order-card.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [OrderCardComponent, CommonModule],
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss'], 
})
export class RecordsComponent {
  records$ = new BehaviorSubject<IRecord[]>([]);
  totalCount$ = new BehaviorSubject<number>(0);
  private _page$ = new BehaviorSubject<number>(1);
  private _pageSize$ = new BehaviorSubject<number>(10);
  private _destroyRef = inject(DestroyRef);
  private _recordApiService = inject(RecordApiService);
  private _dialog = inject(MatDialog);

  constructor() {
    this._loadRecords();
  }

  private _loadRecords(): void {
    this._page$
      .pipe(
        switchMap((page) =>
          this._recordApiService.getRecords({
            page,
            size: this._pageSize$.value,
          })
        ),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((response: TResGetRecord) => {
        this.records$.next(response.rows);
        this.totalCount$.next(response.infoPage?.totalCount || 0);
      });
  }

  onClickCreate(): void {
    const dialogRef = this._dialog.open(RecordsWindowComponent, {
      width: '600px',
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._page$.next(1);
      }
    });
  }

  onClickEdit(record: IRecord): void {
    const dialogRef = this._dialog.open(RecordsWindowComponent, {
      width: '600px',
      data: record,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._page$.next(this._page$.value);
      }
    });
  }
}
