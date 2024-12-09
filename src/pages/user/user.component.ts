import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UserApiService } from '@entity';
import { IGetUser } from '@entity';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  users: any[] = [];

  constructor(private userApiService: UserApiService) {
    this.userApiService.getUser().subscribe((response: IGetUser) => {
      this.users = response.users;
    });
  }
}
