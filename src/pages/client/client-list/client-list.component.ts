import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { BehaviorSubject, switchMap, combineLatestWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IClient, TResGetClients, ClientApiService } from '@entity';
import { ClientWindowComponent } from 'src/widgets/clients/client-window/client-window.component';
import { ERouteConstans } from '@routes';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.scss',
})
export class ClientListComponent {
  protected readonly ERoutesConstans = ERouteConstans;
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'middleName',
    'birthDate',
    'telegramId',
    'actions',
    'view',
  ];
  dataSource$ = new BehaviorSubject<IClient[]>([]);
  totalCount$ = new BehaviorSubject<number>(0);
  private _page$ = new BehaviorSubject<number>(1);
  private _pageSize$ = new BehaviorSubject<number>(10);
  private _clientApiService = inject(ClientApiService);
  private _dialog = inject(MatDialog);
  private _destroyRef = inject(DestroyRef);
  private _router = inject(Router);

  constructor() {
    this._page$
      .pipe(
        combineLatestWith(this._pageSize$),
        switchMap(([page, pageSize]) => this._clientApiService.getClients({ page, pageSize })),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((response: TResGetClients) => {
        this.dataSource$.next(response.rows);
        this.totalCount$.next(response.infoPage.totalCount);
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

  createClient() {
    const dialogRef = this._dialog.open(ClientWindowComponent);
    dialogRef.componentInstance.client.subscribe((newClient: IClient) => {
      console.log('Создан клиент:', newClient);
      this._page$.next(this._page$.value);
    });
  }

  viewClient(client: IClient): void {
    this._router.navigate([this.ERoutesConstans.CLIENT_PANEL, this.ERoutesConstans.CLIENT_PAGE.replace(':id', client.id)]);
  }

  editClient(client: IClient): void {
    const dialogRef = this._dialog.open(ClientWindowComponent, {
      data: client,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Обновлен клиент:', result);
        this._page$.next(this._page$.value);
      }
    });
  }

  deleteClient(client: IClient): void {
    if (
      confirm(
        `Вы уверены, что хотите удалить клиента ${client.firstName} ${client.lastName}?`
      )
    ) {
      this._clientApiService.deleteClient(client.id).subscribe({
        next: (response) => {
          console.log('Клиент успешно удален', response);
          this._page$.next(this._page$.value);
        },
        error: (error) => {
          console.error('Ошибка удаления клиента', error);
        },
      });
    }
  }
}