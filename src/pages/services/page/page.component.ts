import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';  // Импортируем для работы с мультивыбором

import { IServices, IGetService, IUpdateService } from '@entity';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';

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
    ],
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent implements OnInit {
  id: string | null = null;
  service: IUpdateService | null = null;
  roles: string[] = ['Admin', 'Manager', 'Stylist'];  // Пример ролей
  employees: string[] = ['Employee 1', 'Employee 2', 'Employee 3'];  // Пример сотрудников
  serviceForm: FormGroup;

  constructor(private route: ActivatedRoute, private fb: FormBuilder) {
    this.serviceForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      employees: [[], Validators.required],
      roles: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      if (this.id) {
        this.loadService(this.id);
      }
    });
  }
  
  loadService(id: string): void {
    // Здесь можно запросить данные сервиса по id и заполнить форму
    this.service = {
      id,
      name: 'Example Service',
      description: 'Example Description',
      price: '100',
      creatorId: 'creatorId',
    };
    this.serviceForm.patchValue(this.service); // Заполнение формы существующими данными
  }

  onSubmit(): void {
    if (this.serviceForm.valid) {
      console.log(this.serviceForm.value);
      // Здесь можно отправить данные на сервер
    }
  }

  // Обработчики для мультивыбора
  onEmployeesChange(event: MatSelectChange) {
    console.log('Selected Employees:', event.value);
  }

  onRolesChange(event: MatSelectChange) {
    console.log('Selected Roles:', event.value);
  }
}
