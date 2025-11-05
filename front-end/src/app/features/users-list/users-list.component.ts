import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../core/models/user.model';
import { RouterModule } from '@angular/router';
import { LookupsService } from '../../core/services/lookups/lookups.service';
import { UserPosition, UserRole } from '../../core/models/lookups.model';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-users-list.component',
  imports: [CommonModule, RouterModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit {

  lookupService = inject(LookupsService);
  authService = inject(AuthService);

  userRoles: UserRole[] = [];
  userPositions: UserPosition[] = [];
  isAdmin: boolean = false;

  ngOnInit(): void {
    const lookups = this.lookupService.getLookups();
    console.log(lookups);
    if (lookups) {
      this.userRoles = lookups.userRoles;
      this.userPositions = lookups.userPositions;
    }
    console.log(this.userRoles, this.userPositions);
    //ce ucitamo i user-e ali to preko ngrx store-a kasnije

    const role = this.authService.getUserRole();
    this.isAdmin = role?.roleName === 'Admin';
  }

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
}
