import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { User, } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserRole, UserPosition } from '../../../core/models/lookups.model';
import { LookupsService } from '../../../core/services/lookups/lookups.service';

type UserForm = {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  userRoleId: FormControl<number | null>;
  userPositionId: FormControl<number | null>;
  startDate: FormControl<Date | null>;
  endDate: FormControl<Date | null>;
};

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class ProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private lookupService = inject(LookupsService);

  user?: User;
  userId?: number;
  isNewUser = false;

  userRoles: UserRole[] = [];
  userPositions: UserPosition[] = []

  profileForm = new FormGroup<UserForm>({
    firstName: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required),
    email: new FormControl(null, { validators: [Validators.required, Validators.email] }),
    userRoleId: new FormControl<number | null>(null, Validators.required),
    userPositionId: new FormControl<number | null>(null, Validators.required),
    startDate: new FormControl<Date | null>(null, Validators.required),
    endDate: new FormControl<Date | null>(null),
  });

  ngOnInit(): void {
    this.userRoles = this.lookupService.getLookups().userRoles; //mozda ce i ove stvari da idu preko store-a u ngrx kasnije
    this.userPositions = this.lookupService.getLookups().userPositions;

    this.userId = Number(this.route.snapshot.params['id']);
    this.isNewUser = !this.userId;

    if (!this.isNewUser) {
      const existing = this.authService.getUser();
      if (existing) {
        this.user = existing;
        this.profileForm.patchValue(existing);
      }
    }
  }

  save() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const data = this.profileForm.getRawValue();
    if (this.isNewUser) {
      console.log('Creating new user', data);
    } else {
      console.log('Updating user', this.userId, data);
    }
    this.router.navigate(['/home/users']);
  }
}
