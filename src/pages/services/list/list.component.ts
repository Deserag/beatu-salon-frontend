import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import {
  IProducts,
  IServices,
  ServicesApiService,
  TresGetProduct,
  TResGetService,
} from '@entity';
import { ERouteConstans } from '@routes';
import { BehaviorSubject, combineLatestWith, switchMap } from 'rxjs';
import { ServiceWindowComponent } from 'src/widgets/services';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, AsyncPipe],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  protected readonly ERoutesConstans = ERouteConstans;
  displayedColumns: string[] = ['Name', 'Price', 'Symbol'];
  dataSource$ = new BehaviorSubject<IProducts[]>([]);
  totalCount$ = new BehaviorSubject<number>(0);
  private _page$ = new BehaviorSubject<number>(1);
  private _pageSize$ = new BehaviorSubject<number>(10);
  private _serviceApiService = inject(ServicesApiService);
  private _dialog = inject(MatDialog);
  private _destroyRef = inject(DestroyRef);

  constructor(private router: Router) {
    this._page$
      .pipe(
        combineLatestWith(this._pageSize$),
        switchMap(([page, pageSize]) =>
          this._serviceApiService.getProduct({ page, pageSize })
        ),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((response: TresGetProduct) => {
        this.dataSource$.next(response.rows);
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
  onClickCreateService(): void {
    this.router.navigate([
      this.ERoutesConstans.SERVICES_PANEL,
      this.ERoutesConstans.SERVICE_PAGE,
    ]);
  }

  onClickEditService(service: IServices) {
    this.router.navigate(['./', service.id]); 
  }

  onClickDeleteService(service: IServices) {}
}
