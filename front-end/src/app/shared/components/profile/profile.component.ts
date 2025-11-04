import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserRole, UserPosition, User } from '../../../core/models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  isNewUser: boolean = false;
  userId?: number;

  userRoles: UserRole[] = [
    { userRoleId: 1, roleName: 'Admin' },
    { userRoleId: 2, roleName: 'Employee' },
    { userRoleId: 3, roleName: 'Manager' },
  ];

  userPositions: UserPosition[] = [
    { userPositionId: 1, userPositionName: 'Developer' },
    { userPositionId: 2, userPositionName: 'Designer' },
    { userPositionId: 3, userPositionName: 'HR' },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];
    this.isNewUser = !this.userId;

    // ako postoji userId → fetch user iz API
    const user = this.isNewUser ? null : this.getUserById(this.userId!); //!!!!!!

    this.profileForm = this.fb.group({
      firstName: [user?.firstName || '', Validators.required],
      lastName: [user?.lastName || '', Validators.required],
      email: [user?.email || '', [Validators.required, Validators.email]],
      userRoleId: [user?.userRoleId || this.userRoles[1].userRoleId, Validators.required],
      userPositionId: [user?.userPositionId || this.userPositions[0].userPositionId, Validators.required],
      startDate: [user?.startDate?.toISOString().substring(0,10) || '', Validators.required],
      endDate: [user?.endDate ? user.endDate.toISOString().substring(0,10) : '']
    });
  }

  getUserById(id: number): User | null {
    // ovde ide poziv ka API da se dobije user po ID
    // za primer vraćamo null
    return null;
  }

  save() {
    if (this.profileForm.valid) {
      const data = this.profileForm.value;
      if (this.isNewUser) {
        console.log('Creating new user', data);
        // poziv API za kreiranje
      } else {
        console.log('Updating user', this.userId, data);
        // poziv API za update
      }

      this.router.navigate(['/users']); // nakon save vraća na listu
    }
  }
}