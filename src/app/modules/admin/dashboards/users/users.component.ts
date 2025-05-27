import { Component } from '@angular/core';
import { TableUsersComponent } from 'app/modules/component/table/users/users.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    TableUsersComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

}
