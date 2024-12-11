import { Component } from '@angular/core';
import { IUserRole, UserApiService } from '@entity';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-user-role',
  standalone: true,
  imports: [],
  templateUrl: './user-role.component.html',
  styleUrl: './user-role.component.scss'
})
export class UserRoleComponent {
  roles = new BehaviorSubject<IUserRole[]>([]);
  private _pages$ = new BehaviorSubject<number>(1);
  private _pageSize$ = new BehaviorSubject<number>(10);
  totalCount$ = new BehaviorSubject<number>(0);

  constructor (
    private _roleApiService: UserApiService,
  ) {
    
  }}