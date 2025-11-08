import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { User } from '../../core/models/user.model';
import { RouterModule } from '@angular/router';
import { LookupsService } from '../../core/services/lookups/lookups.service';
import { UserPosition, UserRole } from '../../core/models/lookups.model';
import { AuthService } from '../../core/services/auth/auth.service';
import { Store, StoreModule } from '@ngrx/store';
import * as UsersActions from '../../store/users/users.actions';
import { selectAllUsers, selectUserById, selectUsersLoading } from '../../store/users/users.selectors';
import { Observable } from 'rxjs';
import { AppState } from '../../store/app.state';
import { UserService } from '../../core/services/user/user.service';

@Component({
  selector: 'app-users-list.component',
  imports: [CommonModule, RouterModule, StoreModule],
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
  isAdmin = signal(false); // signal umesto booleana

  constructor() {
    const userId = this.userService.getUserId();
    if (!userId) return;
    const userSignal = this.store.selectSignal(selectUserById(userId));
    effect(() => {
      const user = userSignal();
      if (!user) {
        this.store.dispatch(UsersActions.loadUserById({ userId }));
      }
      this.isAdmin.set(!!user && user.userRole?.roleName === 'Admin');
    });
  }

  ngOnInit(): void {
    const lookups = this.lookupService.getLookups();

    if (lookups) {
      this.userRoles = lookups.userRoles;
      this.userPositions = lookups.userPositions;
    }
    this.store.dispatch(UsersActions.loadUsers());
    this.users$ = this.store.select(selectAllUsers);
    this.loading$ = this.store.select(selectUsersLoading);
  }

  onDelete(userId: number) {
      this.store.dispatch(UsersActions.deleteUser({ userId }));
  }
}
