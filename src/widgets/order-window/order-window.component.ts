import { Component, inject, DestroyRef } from '@angular/core';
import { CommonModule, AsyncPipe, NgFor, NgIf } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import {
  IClientsOrders,
  IClient,
  IWorker,
  IService,
  IOffice,
  ICabinet,
  ClientApiService,
  ServicesApiService,
  OfficeApiService,
  TResGetClients,
  TResGetWorkers,
  TResGetOffice,
  TResGetCabinet,
  UserApiService,
  TResGetService,
} from '@entity';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { BehaviorSubject, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-order-window',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSelectModule,
    AsyncPipe,
    NgFor,
    NgIf,
  ],
  templateUrl: './order-window.component.html',
  styleUrl: './order-window.component.scss',
})
export class OrderWindowComponent {
  dialogRef = inject(MatDialogRef<OrderWindowComponent>);
  data: IClientsOrders | null = inject(MAT_DIALOG_DATA);
  private _clientApiService = inject(ClientApiService);
  private _serviceApiService = inject(ServicesApiService);
  private _officeApiService = inject(OfficeApiService);
  private _userApiService = inject(UserApiService);
  private destroyRef = inject(DestroyRef);

  orderForm: Partial<IClientsOrders> = this.data ? { ...this.data } : {};

  clients$ = new BehaviorSubject<IClient[]>([]);
  masters$ = new BehaviorSubject<IWorker[]>([]);
  services$ = new BehaviorSubject<IService[]>([]);
  offices$ = new BehaviorSubject<IOffice[]>([]);
  cabinets$ = new BehaviorSubject<ICabinet[]>([]);

  constructor() {
    this.loadDropdownData();
    if (this.data?.officeId) {
      this.loadCabinetsByOffice(this.data.officeId);
    }
  }

  loadDropdownData(): void {
    this._clientApiService
      .getClients({ page: 1, pageSize: 9999 })
      .pipe(
        map((res: TResGetClients) => res.rows),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((clients) => this.clients$.next(clients));

    this._userApiService
      .getUser({ page: 1, pageSize: 9999 })
      .pipe(
        map((res: TResGetWorkers) => res.rows),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((masters) => this.masters$.next(masters));

    this._serviceApiService
      .getService({ page: 1, pageSize: 9999 })
      .pipe(
        map((res: TResGetService) => res.rows),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((services) => this.services$.next(services));

    this._officeApiService
      .getOffice({ page: 1, pageSize: 9999 })
      .pipe(
        map((res: TResGetOffice) => res.rows),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((offices) => this.offices$.next(offices));
  }

  onOfficeChange(officeId: string): void {
    this.orderForm.workCabinetId = undefined;
    if (officeId) {
      this.loadCabinetsByOffice(officeId);
    } else {
      this.cabinets$.next([]);
    }
  }

  loadCabinetsByOffice(officeId: string): void {
    this._officeApiService
      .getCabinetsByOffice({page: 1, pageSize: 9999 })
      .pipe(
        map((res: TResGetCabinet) => res.rows),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (cabinets) => this.cabinets$.next(cabinets),
        error: (err) => console.error('Ошибка при загрузке кабинетов:', err),
      });
  }

  onSave(): void {
    if (this.orderForm.dateTime) {
      this.orderForm.dateTime = new Date(this.orderForm.dateTime).toISOString();
    }
    this.dialogRef.close(this.orderForm);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  isFormValid(): boolean {
    return (
      !!this.orderForm.clientId &&
      !!this.orderForm.workerId &&
      !!this.orderForm.serviceId &&
      !!this.orderForm.officeId &&
      !!this.orderForm.workCabinetId &&
      !!this.orderForm.dateTime
    );
  }
}
