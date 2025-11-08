import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { User } from '../../core/models/user.model';
import { RouterModule } from '@angular/router';
import { LookupsService } from '../../core/services/lookups/lookups.service';
import { UserPosition, UserRole } from '../../core/models/lookups.model';
import { Store, StoreModule } from '@ngrx/store';
import * as UsersActions from '../../store/users/users.actions';
import { selectAllUsers, selectUserById, selectUsersLoading } from '../../store/users/users.selectors';
import { Observable } from 'rxjs';
import { AppState } from '../../store/app.state';
import { UserService } from '../../core/services/user/user.service';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

type UserFilterForm = {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  userRoleId: FormControl<number | null>;
  userPositionId: FormControl<number | null>;
};

@Component({
  selector: 'app-users-list.component',
  imports: [CommonModule, RouterModule, StoreModule, ReactiveFormsModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit {

  lookupService = inject(LookupsService);
  userService = inject(UserService);
  store = inject(Store<AppState>);

  users$!: Observable<User[]>;
  loading$!: Observable<boolean>;

  userRoles: UserRole[] = [];
  userPositions: UserPosition[] = [];
  isAdmin = signal(false);

  filterForm!: FormGroup<UserFilterForm>;

  constructor() {
    const userId = this.userService.getUserId();
    if (!userId) return;

    this.userService.getUserById(userId).subscribe(user => {
      this.isAdmin.set(user.userRole?.roleName === 'Admin');
    });

    this.filterForm = new FormGroup<UserFilterForm>({
      firstName: new FormControl<string | null>(null),
      lastName: new FormControl<string | null>(null),
      email: new FormControl<string | null>(null),
      userRoleId: new FormControl<number | null>(null),
      userPositionId: new FormControl<number | null>(null),
    });
  }

  ngOnInit(): void {
    const lookups = this.lookupService.getLookups();

    if (lookups) {
      this.userRoles = lookups.userRoles;
      this.userPositions = lookups.userPositions;
    }
    this.store.dispatch(UsersActions.loadUsers({}));
    this.users$ = this.store.select(selectAllUsers);
    this.loading$ = this.store.select(selectUsersLoading);
  }

  onFilter() {
    const filterValues = this.filterForm.getRawValue();

    const filterDto = {
      firstName: filterValues.firstName || undefined,
      lastName: filterValues.lastName || undefined,
      email: filterValues.email || undefined,
      userRoleId: filterValues.userRoleId || undefined,
      userPositionId: filterValues.userPositionId || undefined
    };

    this.store.dispatch(UsersActions.loadUsers({ filter: filterDto }));
    this.users$ = this.store.select(selectAllUsers);
  }

  onDelete(userId: number) {
      this.store.dispatch(UsersActions.deleteUser({ userId }));
  }
}
