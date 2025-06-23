import { NgIf, NgFor } from '@angular/common';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import { IClient, ClientApiService } from '@entity';

@Component({
  selector: 'app-client-window',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgIf,
    NgFor,
  ],
  templateUrl: './client-window.component.html',
  styleUrls: ['./client-window.component.scss'],
})
export class ClientWindowComponent {
  @Output() client = new EventEmitter<IClient>();

  form = new FormGroup({
    id: new FormControl<string | null>(null),
    firstName: new FormControl<string>('', Validators.required),
    lastName: new FormControl<string>('', Validators.required),
    middleName: new FormControl<string>(''),
    birthDate: new FormControl<Date | null>(null, Validators.required),
    telegramId: new FormControl<string>('', Validators.required),
  });

  constructor(
    private _dialogRef: MatDialogRef<ClientWindowComponent>,
    private _clientApiService: ClientApiService,
    @Inject(MAT_DIALOG_DATA) public data: IClient | null
  ) {
    if (this.data) {
      this.initializeForm(this.data);
    }
  }

  initializeForm(client: IClient) {
    this.form.patchValue({
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      middleName: client.middleName,
      birthDate: new Date(client.birthDate),
      telegramId: client.telegramId,
    });
  }

  submit() {
    if (this.form.valid) {
      const clientData = this.form.value;

      if (clientData.id) {
        this.updateClient(clientData);
      } else {
        const { id, ...clientWithoutId } = clientData;
        this.createClient(clientWithoutId);
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  createClient(client: any) {
    this._clientApiService.createClient(client).subscribe({
      next: (response) => {
        console.log('Создан клиент:', response);
        this.client.emit(response);
        this._dialogRef.close(response);
      },
      error: (error) => {
        console.error('Ошибка при создании клиента:', error);
      },
    });
  }

  updateClient(client: any) {
    this._clientApiService.updateClient(client).subscribe({

      next: (response) => {
        console.log('Обновлен клиент:', response);
        this._dialogRef.close(response);
      },
      error: (error) => {
        console.error('Ошибка при обновлении клиента:', error);
      },
    });
  }

  close() {
    this._dialogRef.close();
  }
}
