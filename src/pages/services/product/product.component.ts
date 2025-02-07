import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { IProducts, ServicesApiService, TresGetProduct } from '@entity';
import { ERouteConstans } from '@routes';
import { BehaviorSubject, combineLatestWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-product',
  standalone: true,
   imports: [MatTableModule, MatPaginatorModule, MatSortModule, AsyncPipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent {
  protected readonly ERoutesConstans = ERouteConstans;
  displayedColumns: string[] = ['Name', 'Volume', 'Unit', 'Quantity', 'Prices', 'Symbol'];
  dataSource$ = new BehaviorSubject<IProducts[]>([]);
  totalCount$ = new BehaviorSubject<number>(0);
  private _page$ = new BehaviorSubject<number>(1);
  private _pageSize$ = new BehaviorSubject<number>(10);
  private _serviceApiService = inject(ServicesApiService);
  private _dialog = inject(MatDialog);
  private _destroyRef = inject(DestroyRef);

    constructor() {
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
    
      onClickCreateProduct() {
        // const dialogRef = this._dialog.open(ServiceWindowComponent);
        // dialogRef.componentInstance.
      }
    
      onClickUpdateProduct(product: IProducts) {}
    
      onClickDeleteProduct(product: IProducts) {}
}
