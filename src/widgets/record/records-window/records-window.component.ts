import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {
  combineLatest,
  filter,
  map,
  Observable,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs';
import {
  RecordApiService,
  ServicesApiService,
  OfficeApiService,
  IUser,
  IService,
  IOffice,
  ICabinet,
  TResGetService,
  TResGetOffice,
  TResGetCabinet,
  TResGetUsers,
  UserApiService,
} from '@entity';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

function futureDateTimeValidator(): Validators {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const selectedDateTime = new Date(control.value);
    const currentDateTime = new Date();

    if (selectedDateTime.getTime() < currentDateTime.getTime()) {
      return { pastDateTime: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-records-window',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './records-window.component.html',
  styleUrls: ['./records-window.component.scss'],
})
export class RecordsWindowComponent {
  form: FormGroup;
  clients: IUser[] = [];
  services: IService[] = [];
  masters: IUser[] = [];
  offices: IOffice[] = [];
  cabinets: ICabinet[] = [];

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<RecordsWindowComponent>);
  data = inject(MAT_DIALOG_DATA);
  private recordApi = inject(RecordApiService);
  private serviceApi = inject(ServicesApiService);
  private officeApi = inject(OfficeApiService);
  private userApi = inject(UserApiService);

  private adminId: string = '';

  constructor() {
    try {
      this.adminId = JSON.parse(localStorage.getItem('user') || '{}').id || '';
    } catch {
      this.adminId = '';
    }

    this.form = this.fb.group({
      clientId: [this.data.client?.id || '', Validators.required],
      serviceId: [this.data?.service?.id || '', Validators.required],
      masterId: [this.data?.worker?.id || '', Validators.required],
      officeId: [this.data?.office?.id || '', Validators.required],
      cabinetId: [this.data?.cabinet?.id || '', Validators.required],
      dateTime: [
        this.data?.dateTime || '',
        [Validators.required, futureDateTimeValidator()],
      ],
    });

    combineLatest([
      this.userApi.getUser({ page: 1, pageSize: 100 }).pipe(
        map((res: TResGetUsers) => res.rows),
        tap((users) => (this.clients = users))
      ),
      this.serviceApi.getService({ page: 1, pageSize: 100 }).pipe(
        map((res: TResGetService) => res.rows),
        tap((services) => (this.services = services))
      ),
      this.officeApi.getOffice({ page: 1, pageSize: 100 }).pipe(
        map((res: TResGetOffice) => res.rows),
        tap((offices) => (this.offices = offices))
      ),
      this.officeApi.getCabinets({ page: 1, pageSize: 100 }).pipe(
        map((res: TResGetCabinet) => res.rows),
        tap((cabinets) => (this.cabinets = cabinets))
      ),
    ])
      .pipe(
        take(1),
        tap(() => {
          if (!this.form.get('clientId')!.value && this.adminId) {
            this.form.get('clientId')!.setValue(this.adminId);
          }

          if (this.data?.service?.id) {
            this.recordApi
              .getMastersByService(this.data.service.id)
              .pipe(
                take(1),
                map((response) => response.map((item: any) => item.worker))
              )
              .subscribe((list) => (this.masters = list));
          }
        })
      )
      .subscribe({
        error: (err) => console.error('Error loading initial data:', err),
      });

    this.form
      .get('serviceId')!
      .valueChanges.pipe(
        startWith(this.form.get('serviceId')!.value),
        filter((id) => !!id),
        switchMap((id) =>
          this.recordApi
            .getMastersByService(id)
            .pipe(map((response) => response.map((item: any) => item.worker)))
        )
      )
      .subscribe((list) => {
        this.masters = list;
        if (
          this.form.get('masterId')!.value &&
          !list.some((master) => master.id === this.form.get('masterId')!.value)
        ) {
          this.form.get('masterId')!.reset('');
        }
      });

    this.form
      .get('serviceId')!
      .valueChanges.pipe(filter((id) => !id))
      .subscribe(() => {
        this.masters = [];
        this.form.get('masterId')!.reset('');
      });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;

    const payload = {
      userId: v.clientId,
      masterId: v.masterId,
      serviceId: v.serviceId,
      officeId: v.officeId,
      workCabinetId: v.cabinetId,
      date: new Date(v.dateTime),
    };

    const obs: Observable<any> = this.data?.id
      ? this.recordApi.updateRecord({ ...payload, id: this.data.id })
      : this.recordApi.createRecord(payload);

    obs.pipe(take(1)).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => console.error('Error submitting record:', err),
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
