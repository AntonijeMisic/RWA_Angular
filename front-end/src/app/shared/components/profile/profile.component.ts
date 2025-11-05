import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { User, } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserRole, UserPosition } from '../../../core/models/lookups.model';
import { LookupsService } from '../../../core/services/lookups/lookups.service';
import { UserService } from '../../../core/services/user/user.service';

type UserForm = {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
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
  private userService = inject(UserService);
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
    password: new FormControl(null),
    userRoleId: new FormControl<number | null>(null, Validators.required),
    userPositionId: new FormControl<number | null>(null, Validators.required),
    startDate: new FormControl<Date | null>(null, Validators.required),
    endDate: new FormControl<Date | null>(null),
  });

  ngOnInit(): void {
    this.userRoles = this.lookupService.getLookups().userRoles; //mozda ce i ove stvari da idu preko store-a u ngrx kasnije
    this.userPositions = this.lookupService.getLookups().userPositions;

    const idParam = this.route.snapshot.params['id'];
    this.userId = idParam ? Number(idParam) : undefined;
    this.isNewUser = !this.userId;

    if (this.isNewUser) {
      this.profileForm.controls.password.setValidators(Validators.required);
      this.profileForm.controls.password.updateValueAndValidity();
    }
    else {
      const existing = this.authService.getUser();
      if (existing) {
        this.user = existing;
        const { password, ...rest } = existing;

        this.profileForm.patchValue({
          ...rest,
          password: null
        });
      }
      this.profileForm.controls.password.clearValidators();
      this.profileForm.controls.password.updateValueAndValidity();
    }
  }

  save() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const userData = this.profileForm.getRawValue();

    const payload: Partial<User> = {
      userId: this.isNewUser ? null : this.userId!,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      userRoleId: userData.userRoleId || 0,
      userRole: this.userRoles.find(ur => ur.userRoleId === userData.userRoleId)!,
      userPositionId: userData.userPositionId || 0,
      userPosition: this.userPositions.find(up => up.userPositionId === userData.userPositionId)!,
      startDate: userData.startDate || new Date(),
      endDate: userData.endDate || null
    };

    if (userData.password) {
      payload.password = userData.password;
    }

    const request$ = this.isNewUser
      ? this.userService.register(payload as User)
      : this.userService.update(payload as User);

    request$.subscribe({
      next: res => {
        console.log('Success:', res);
        this.router.navigate(['/home/users']);
      },
      error: err => console.error('Error while saving:', err)
    });
  }
}
