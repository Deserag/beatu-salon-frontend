import { NgFor, NgIf } from '@angular/common';
import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IRole, UserApiService } from '@entity';

@Component({
  selector: 'app-role-window',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './role-window.component.html',
  styleUrls: ['./role-window.component.scss'],
})
export class RoleWindowComponent {
  @Output() role = new EventEmitter<IRole>();
  form = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    description: new FormControl<string>('', Validators.required),
  });

  constructor(
    private _dialogRef: MatDialogRef<RoleWindowComponent>,
    private _userApiService: UserApiService,
    @Inject(MAT_DIALOG_DATA) public data: IRole | null
  ) {
    if (this.data) {
      this.form.patchValue({
        name: this.data.name,
        description: this.data.description,
      });
    }
  }

  submit() {
    if (this.form.valid) {
      const roleData = this.form.value as IRole; 

      if (this.data) {
        this.updateRole(roleData);
      } else {
        this.onClickCreateRole(roleData);
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  onClickCreateRole(role: any) {
    this._userApiService.createRole(role).subscribe({
      next: (response) => {
        console.log('Создана роль:', response);
        this._dialogRef.close(response);
      },
      error: (error) => {
        console.error('Ошибка создания роли:', error);
      },
    });
  }

  updateRole(role: any) {
    const roleId = this.data?.id; 
    if (!roleId) {
      console.error("роль ID, необходим для обновления, отсутствует");
      return;
    }

    this._userApiService.updateRole(role).subscribe({
      next: (response) => {
        console.log('Роль обновлена:', response);
        this._dialogRef.close(response);
      },
      error: (error) => {
        console.error('Ошибка обновления роли:', error);
      },
    });
  }


  close() {
    this._dialogRef.close();
  }
}