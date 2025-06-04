import { CommonModule } from '@angular/common';
import { Component, inject, DestroyRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, switchMap, combineLatestWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  IClientsOrders,
  ClientApiService,
  TResGetClientsOrders,
} from '@entity';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { OrderWindowComponent } from 'src/widgets/order-window/order-window.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-clients-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './clients-orders.component.html',
  styleUrls: ['./clients-orders.component.scss'],
})
export class ClientsOrdersComponent {
  private api = inject(ClientApiService);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  orders$ = new BehaviorSubject<IClientsOrders[]>([]);
  totalCount$ = new BehaviorSubject(0);
  loading$ = new BehaviorSubject(false);

  page$ = new BehaviorSubject(1);
  pageSize$ = new BehaviorSubject(10);

  displayedColumns = [
    'fullName',
    'master',
    'service',
    'price',
    'dateTime',
    'office',
    'actions',
  ];

  constructor() {
    this.page$
      .pipe(
        combineLatestWith(this.pageSize$),
        switchMap(([page, pageSize]) => {
          this.loading$.next(true);
          return this.api.getOrders({ page, pageSize });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (res: TResGetClientsOrders) => {
          this.orders$.next(res.rows);
          this.totalCount$.next(res.infoPage.totalCount);
          this.loading$.next(false);
        },
        error: () => {
          this.loading$.next(false);
        },
      });
  }

  onPageChange(event: PageEvent) {
    this.pageSize$.next(event.pageSize);
    this.page$.next(event.pageIndex + 1);
  }

  openCreate() {
    const ref = this.dialog.open(OrderWindowComponent, { data: null });
    ref
      .afterClosed()
      .subscribe((newOrderData: Partial<IClientsOrders> | false) => {
        if (newOrderData) {
          this.api
            .createOrder(newOrderData)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => this.reload(),
              error: (err) => console.error('Ошибка при создании заказа:', err),
            });
        }
      });
  }

  openEdit(order: IClientsOrders) {
    const ref = this.dialog.open(OrderWindowComponent, { data: order });
    ref
      .afterClosed()
      .subscribe((updatedOrderData: Partial<IClientsOrders> | false) => {
        if (updatedOrderData && updatedOrderData.id) {
          this.api
            .updateOrder(updatedOrderData.id, updatedOrderData)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => this.reload(),
              error: (err) =>
                console.error('Ошибка при обновлении заказа:', err),
            });
        }
      });
  }

  deleteOrder(id: string) {
    if (!confirm('Вы точно хотите удалить этот заказ?')) return;

    this.api
      .deleteOrder(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.reload(),
        error: (err) => console.error('Ошибка при удалении заказа:', err),
      });
  }

  reload() {
    this.page$.next(this.page$.value);
  }
}
