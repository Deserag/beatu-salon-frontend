import {
  Component,
  Inject,
  inject,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  IOffice,
  OfficeApiService,
  ICreateOffice,
  IUpdateOffice,
} from '@entity';
import {
  MatFormFieldModule
} from '@angular/material/form-field';
import {
  MatInputModule
} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-office-window',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './office-window.component.html',
  styleUrl: './office-window.component.scss',
})
export class OfficeWindowComponent {
  @Output() office = new EventEmitter<IOffice>();

  form = new FormGroup({
    id: new FormControl<string | null>(null),
    number: new FormControl<string>('', Validators.required),
    address: new FormControl<string>('', Validators.required),
  });

  private _dialogRef = inject(MatDialogRef<OfficeWindowComponent>);
  private _officeApiService = inject(OfficeApiService);

  private _adminId: string = (() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user?.id || '';
    } catch {
      return '';
    }
  })();

  constructor(@Inject(MAT_DIALOG_DATA) public data: IOffice | null) {
    if (data) {
      this._initializeForm(data);
    }
  }

  private _initializeForm(data: IOffice): void {
    this.form.patchValue({
      id: data.id,
      number: data.number,
      address: data.address,
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { id, number, address } = this.form.value;

    if (id) {
      const updateOffice: IUpdateOffice = {
        id,
        number: number!,
        address: address!,
        creatorId: this._adminId,
      };
      this._update(updateOffice);
    } else {
      const createOffice: ICreateOffice = {
        number: number!,
        address: address!,
        creatorId: this._adminId,
      };
      this._create(createOffice);
    }
  }

  private _create(office: ICreateOffice): void {
    this._officeApiService.createOffice(office).subscribe({
      next: (response) => {
        this._dialogRef.close(response);
        this.office.emit(response);
      },
      error: (err) => console.error('Ошибка создания офиса:', err),
    });
  }

  private _update(office: IUpdateOffice): void {
    this._officeApiService.updateOffice(office).subscribe({
      next: (response) => {
        this._dialogRef.close(response);
        this.office.emit(response);
      },
      error: (err) => console.error('Ошибка обновления офиса:', err),
    });
  }

  close(): void {
    this._dialogRef.close();
  }
}
