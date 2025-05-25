import { Component, Inject, EventEmitter, Output, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  ICabinet,
  OfficeApiService,
  ICreateCabinet,
  IUpdateCabinet,
  IOffice,
  IResTablePage,
} from '@entity';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-cabinet-window',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgFor,
    MatButtonModule,
    AsyncPipe,
  ],
  templateUrl: './cabinet-window.component.html',
  styleUrl: './cabinet-window.component.scss',
})
export class CabinetWindowComponent implements OnInit {
  @Output() cabinet = new EventEmitter<ICabinet>();
  form = new FormGroup({
    id: new FormControl<string | null>(null),
    number: new FormControl<string>('', Validators.required),
    officeId: new FormControl<string>('', Validators.required),
  });
  offices$ = new BehaviorSubject<IOffice[]>([]);
  private _destroyRef = inject(DestroyRef);
  private readonly creatorId: string = (() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user?.id || '';
    } catch {
      return '';
    }
  })();

  constructor(
    private _dialogRef: MatDialogRef<CabinetWindowComponent>,
    private _officeApiService: OfficeApiService,
    @Inject(MAT_DIALOG_DATA) public data: ICabinet | null
  ) {}

  ngOnInit(): void {
    this.loadOffices();
    if (this.data) {
      this.initializeForm(this.data);
    }
  }

  loadOffices(): void {
    this._officeApiService
      .getOffice({ page: 1, pageSize: 1000 })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response: IResTablePage<IOffice>) => {
          this.offices$.next(response.rows);
        },
        error: (error) => {
          console.error('Ошибка при загрузке офисов:', error);
        },
      });
  }

  initializeForm(cabinet: ICabinet): void {
    this.form.patchValue({
      id: cabinet.id,
      number: cabinet.number,
      officeId: cabinet.officeId,
    });
  }

  submit(): void {
    if (this.form.valid) {
      const formData = this.form.value;
      if (formData.id) {
        const updateData: IUpdateCabinet = {
          id: formData.id,
          number: formData.number!,
          officeId: formData.officeId!,
          creatorId: this.creatorId,
        };
        this.updateCabinet(updateData);
      } else {
        const createData: ICreateCabinet = {
          number: formData.number!,
          officeId: formData.officeId!,
          creatorId: this.creatorId,
        };
        this.createCabinet(createData);
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  createCabinet(cabinet: ICreateCabinet): void {
    this._officeApiService.createCabinet(cabinet).subscribe({
      next: (response) => {
        console.log('Кабинет создан:', response);
        this._dialogRef.close(response);
        this.cabinet.emit(response);
      },
      error: (error) => {
        console.error('Ошибка при создании кабинета:', error);
      },
    });
  }

  updateCabinet(cabinet: IUpdateCabinet): void {
    this._officeApiService.updateCabinet(cabinet).subscribe({
      next: (response) => {
        console.log('Кабинет обновлен:', response);
        this._dialogRef.close(response);
        this.cabinet.emit(response);
      },
      error: (error) => {
        console.error('Ошибка при обновлении кабинета:', error);
      },
    });
  }

  close(): void {
    this._dialogRef.close();
  }
}