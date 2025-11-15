import { Component, effect, inject, OnInit, signal } from '@angular/core';
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
import { UserService } from '../../../core/services/user/user.service';
import { AppState } from '../../../store/app.state';
import { Store } from '@ngrx/store';
import * as UsersActions from '../../../store/users/users.actions';
import { filter, map, switchMap, tap, of, take } from 'rxjs';
import {
  selectSelectedUser,
  selectUserById,
} from '../../../store/users/users.selectors';

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
  private userService = inject(UserService);
  private lookupService = inject(LookupsService);
  private store = inject(Store<AppState>);

  user?: User;
  userId?: number | null;
  isNewUser = false;

  userRoles: UserRole[] = [];
  userPositions: UserPosition[] = [];
  profileForm: FormGroup<UserForm>;

  isAdmin = signal(false);
  private currentUser = signal<User | null>(null);

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

    const currentUserId = this.userService.getUserId();
    if (currentUserId) {
      this.userService.getUserById(currentUserId).subscribe((user) => {
        console.log('Fetched current user:', user);
        console.log(user.userRole?.roleName === 'Admin');
        this.isAdmin.set(user.userRole?.roleName === 'Admin');
        if (user.userRole?.roleName === 'Admin') {
          this.profileForm.controls['userRoleId'].enable();
        } else {
          this.profileForm.controls['userRoleId'].disable();
        }
      });
    }
  }

  ngOnInit(): void {
    this.userRoles = this.lookupService.getLookups().userRoles;
    this.userPositions = this.lookupService.getLookups().userPositions;

    this.route.paramMap
      .pipe(
        map((paramMap) => paramMap.get('id')),
        map((id) => (id ? Number(id) : null)),
        switchMap((userId) => {
          this.userId = userId;
          this.isNewUser = !userId;

          if (this.isNewUser) {
            this.profileForm.reset();
            this.profileForm.controls.password.setValidators(
              Validators.required
            );
            this.profileForm.controls.password.updateValueAndValidity();
            return of(null);
          }

          this.store.dispatch(UsersActions.loadUserById({ userId }));

          return this.store.select(selectSelectedUser).pipe(
            filter((user) => !!user && user.userId === userId)
          );
        })
      )
      .subscribe((user) => {
        if (user) {
          this.user = user;
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

    const userData = this.profileForm.getRawValue();

    const payload: Partial<User> = {
      userId: this.isNewUser ? null : this.userId!,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      userRoleId: userData.userRoleId || 0,
      userRole: this.userRoles.find(
        (ur) => ur.userRoleId === userData.userRoleId
      )!,
      userPositionId: userData.userPositionId || 0,
      userPosition: this.userPositions.find(
        (up) => up.userPositionId === userData.userPositionId
      )!,
      startDate: userData.startDate || new Date(),
      endDate: userData.endDate || null,
    };

    if (userData.password) {
      payload.password = userData.password;
    }

    if (this.isNewUser) {
      this.store.dispatch(UsersActions.createUser({ user: payload as User }));
    } else {
      this.store.dispatch(UsersActions.updateUser({ user: payload as User }));
    }

    this.store
      .select((state) => state.users.loading)
      .pipe(
        filter((loading) => loading === false),
        take(1)
      )
      .subscribe(() => {
        this.router.navigate(['/home/users']);
      });
  }
}
