import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  IRecord,
  ICreateRecord,
  RecordApiService,
  ServicesApiService,
  UserApiService,
  IUser,
} from '@entity';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-records-window',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    CommonModule,
  ],
  templateUrl: './records-window.component.html',
  styleUrls: ['./records-window.component.scss'],
})
export class RecordsWindowComponent {
  form = new FormGroup({
    id: new FormControl<string | null>(null),
    clientId: new FormControl<string>('', Validators.required),
    serviceId: new FormControl<string>('', Validators.required),
    masterId: new FormControl<string>('', Validators.required),
    officeId: new FormControl<string>('', Validators.required),
    date: new FormControl<Date>(new Date(), Validators.required),
  });

  clients$ = new BehaviorSubject<IUser[]>([]);
  masters$ = new BehaviorSubject<IUser[]>([]);
  services$ = new BehaviorSubject<{ id: string; name: string }[]>([]);

  private _dialogRef = inject(MatDialogRef<RecordsWindowComponent>);
  private _recordApiService = inject(RecordApiService);
  private _servicesApiService = inject(ServicesApiService);
  private _userApiService = inject(UserApiService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: IRecord | null) {
    this.loadClients();
    this.loadAllServices();

    if (data) {
      this.form.patchValue({
        id: data.id,
        clientId: data.client?.id || '',
        serviceId: data.service?.id || '',
        masterId: data.master?.id || '',
        officeId: data.office?.id || '',
        date: new Date(data.date),
      });

      if (data.service?.id) {
        this.loadMastersByService(data.service.id);
      }
    }

    this.form.get('clientId')?.valueChanges.subscribe(() => {
      this.masters$.next([]);
      this.form.patchValue({ serviceId: '', masterId: '', officeId: '' });
      // If services were dependent on client, you would load them here.
      // For now, we assume all services are loaded initially.
    });

    this.form.get('serviceId')?.valueChanges.subscribe((serviceId) => {
      this.masters$.next([]);
      this.form.patchValue({ masterId: '', officeId: '' });
      if (serviceId) {
        this.loadMastersByService(serviceId);
      }
    });
  }

  private loadClients(): void {
    this._userApiService
      .getUser({ page: 1, pageSize: 100 })
      .subscribe((res) => {
        this.clients$.next(res.rows);
      });
  }

  private loadAllServices(): void {
    this._servicesApiService
      .getService({ page: 1, pageSize: 100 })
      .subscribe((res) => {
        this.services$.next(
          res.rows.map((service) => ({ id: service.id, name: service.name }))
        );
      });
  }

  private loadMastersByService(serviceId: string): void {
    this._recordApiService
      .getMastersByService(serviceId)
      .subscribe((masters) => {
        this.masters$.next(masters);
      });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;

    const dto: ICreateRecord = {
      clientId: value.clientId!,
      serviceId: value.serviceId!,
      masterId: value.masterId!,
      officeId: value.officeId!,
      date: value.date!,
    };

    if (value.id) {
      this._recordApiService
        .updateRecord({ ...dto, id: value.id })
        .subscribe((res) => this._dialogRef.close(res));
    } else {
      this._recordApiService
        .createRecord(dto)
        .subscribe((res) => this._dialogRef.close(res));
    }
  }

  close(): void {
    this._dialogRef.close();
  }
}
