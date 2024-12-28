import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';  // Импортируем для работы с мультивыбором

import { IServices, IGetService, IUpdateService, ServicesApiService } from '@entity';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgFor, NgIf } from '@angular/common';

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
  id: string | null = null;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _fb: FormBuilder,
    private _servicesApi: ServicesApiService
  ) {
    this.serviceForm = this._fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      employees: [[], Validators.required],
      roles: [[], Validators.required]
    });

    this._route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      if (this.id) this.loadService(this.id);
    });
  }

  loadService(id: string): void {
    this._servicesApi.getServiceById(id).subscribe((service) => {
      this.serviceForm.patchValue(service);
    });
  }

  onSubmit(): void {
    if (this.serviceForm.valid) {
      const updatedService = { ...this.serviceForm.value, id: this.id };
      this._servicesApi.updateService(updatedService).subscribe(() => {
        this._router.navigate(['/']);
      });
    }
  }
}