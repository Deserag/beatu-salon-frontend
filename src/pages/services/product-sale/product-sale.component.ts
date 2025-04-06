import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { IProduct, IProductSale, ServicesApiService, TResGetProduct, TResGetProductSale } from '@entity';
import { ERouteConstans } from '@routes';
import { BehaviorSubject, combineLatestWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-product-sale',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, AsyncPipe],
  templateUrl: './product-sale.component.html',
  styleUrl: './product-sale.component.scss'
})
export class ProductSaleComponent {
  protected readonly ERoutesConstans = ERouteConstans;
  displayedColumns: string[] = ['Name', 'Office', 'Volume', 'Unit', 'Quantity', 'Prices', 'Symbol'];
  dataSource$ = new BehaviorSubject<IProductSale[]>([]);
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
            this._serviceApiService.getProductSale({ page, pageSize })
          ),
          takeUntilDestroyed(this._destroyRef)
        )
        .subscribe((response: TResGetProductSale) => {
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
    
      onClickUpdateProduct(product: IProduct) {}
    
      onClickDeleteProduct(product: IProduct) {}
}
