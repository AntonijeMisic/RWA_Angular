import { Component, inject, OnInit, signal, computed } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../../../core/models/user.model';
import { UserRole, UserPosition } from '../../../core/models/lookups.model';

import { LookupsService } from '../../../core/services/lookups/lookups.service';
import { AppState } from '../../../store/app.state';
import { Store } from '@ngrx/store';

import * as UsersActions from '../../../store/users/users.actions';
import {
  selectSelectedUser,
  selectCurrentUser,
} from '../../../store/users/users.selectors';

import { map, switchMap, filter, take, of } from 'rxjs';

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
  private store = inject(Store<AppState>);
  private lookupService = inject(LookupsService);

  userRoles: UserRole[] = [];
  userPositions: UserPosition[] = [];
  profileForm: FormGroup<UserForm>;

  currentUser$ = this.store.select(selectCurrentUser);

  isAdmin = signal(false);
  routeUserId = signal<number | null>(null);
  isNewUser = computed(() => this.routeUserId() === null);

  constructor() {
    this.profileForm = new FormGroup<UserForm>({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl(null),
      userRoleId: new FormControl<number | null>(null, Validators.required),
      userPositionId: new FormControl<number | null>(null, Validators.required),
      startDate: new FormControl<Date | null>(null, Validators.required),
      endDate: new FormControl<Date | null>(null),
    });
  }

  ngOnInit(): void {
    const lookups = this.lookupService.getLookups();
    this.userRoles = lookups.userRoles;
    this.userPositions = lookups.userPositions;

    this.currentUser$.pipe(filter(Boolean)).subscribe((user) => {
      this.isAdmin.set(user.userRole?.roleName === 'Admin');

      if (this.isAdmin()) {
        this.profileForm.controls['userRoleId'].enable();
      } else {
        this.profileForm.controls['userRoleId'].disable();
      }
    });

    this.route.paramMap
      .pipe(
        map((paramMap) => paramMap.get('id')),
        map((id) => (id ? Number(id) : null)),
        switchMap((userId) => {
          this.routeUserId.set(userId);

          if (this.isNewUser()) {
            this.profileForm.reset();
            this.profileForm.controls.password.setValidators(
              Validators.required
            );
            this.profileForm.controls.password.updateValueAndValidity();
            return of(null);
          }

          this.store.dispatch(UsersActions.loadUserById({ userId }));

          return this.store
            .select(selectSelectedUser)
            .pipe(filter((user) => !!user && user.userId === userId));
        })
      )
      .subscribe((user) => {
        if (user) {
          const { password, ...rest } = user;

          this.profileForm.patchValue({
            ...rest,
            password: null,
          });

          this.profileForm.controls.password.clearValidators();
          this.profileForm.controls.password.updateValueAndValidity();
        }
      });
  }

  save() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const formValue = this.profileForm.getRawValue();

    const payload: Partial<User> = {
      userId: this.isNewUser() ? null : this.routeUserId(),
      firstName: formValue.firstName || '',
      lastName: formValue.lastName || '',
      email: formValue.email || '',
      userRoleId: formValue.userRoleId || 0,
      userRole: this.userRoles.find(
        (r) => r.userRoleId === formValue.userRoleId
      )!,
      userPositionId: formValue.userPositionId || 0,
      userPosition: this.userPositions.find(
        (p) => p.userPositionId === formValue.userPositionId
      )!,
      startDate: formValue.startDate || new Date(),
      endDate: formValue.endDate || null,
    };

    if (formValue.password) {
      payload.password = formValue.password;
    }

    if (this.isNewUser()) {
      this.store.dispatch(UsersActions.createUser({ user: payload as User }));
    } else {
      this.store.dispatch(UsersActions.updateUser({ user: payload as User }));
    }

    this.store
      .select((s) => s.users.loading)
      .pipe(
        filter((l) => !l),
        take(1)
      )
      .subscribe(() => this.router.navigate(['/home/users']));
  }
}