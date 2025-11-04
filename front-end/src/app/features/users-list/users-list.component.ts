import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-users-list.component',
  imports: [CommonModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent {
  users: User[] = [
    {
      userId: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      userRoleId: 1,
      userRole: { roleName: 'Admin' } as any,
      userPositionId: 1,
      userPosition: { userPositionName: 'Developer' } as any,
      startDate: new Date('2023-01-01'),
      endDate: null
    },
    {
      userId: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@company.com',
      userRoleId: 2,
      userRole: { roleName: 'Employee' } as any,
      userPositionId: 2,
      userPosition: { userPositionName: 'Designer' } as any,
      startDate: new Date('2024-03-15'),
      endDate: null
    }
  ];

  isAdmin = true; // simulacija za prikaz Add User dugmeta
}
