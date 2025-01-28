import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IServices, IUpdateService, ServicesApiService } from '@entity';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgFor, NgIf } from '@angular/common';
import { ERouteConstans } from '@routes';

@Component({
  selector: 'app-page',
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
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class ServicePageComponent {
  serviceForm: FormGroup;
  roles = ['Admin', 'Manager', 'Stylist'];
  employees = ['Employee 1', 'Employee 2', 'Employee 3'];
  id: string;
  private creatorId: string = 'd52c32d6-0b2b-46e8-b16f-386fdd20d47d';
  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _servicesApi: ServicesApiService
  ) {
    const state = this._router.getCurrentNavigation()?.extras.state;

    if (!state || !state['id']) {
      this._router.navigate(['/']);
      console.log('Ошибка');
      throw new Error('ID отсутствует');
    } else {
      console.log(state['id']);
    }

    this.id = state['id'];
    console.log(this.id);

    this.serviceForm = this._fb.group({
      creatorId: this.creatorId,
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      // employees: [[], Validators.required],
      // roles: [[], Validators.required],
    });

    this.loadService(this.id);
  }

  loadService(id: string): void {
    this._servicesApi.getServiceById(id).subscribe((service) => {
      this.serviceForm.patchValue(service);
    });
  }

  onSubmit(): void {
    if (this.serviceForm.valid) {
      const updatedService = {
        ...this.serviceForm.value,
        id: this.id, // id будет обновляться с текущим значением
      };

      this._servicesApi.updateService(updatedService).subscribe(() => {
        this._router.navigate([ERouteConstans.SERVICES_PANEL]);
      });
    }
  }
}
