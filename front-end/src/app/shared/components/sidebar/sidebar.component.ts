import { Component, inject, signal, effect } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';

import { AuthService } from '../../../core/services/auth/auth.service';
import { AppState } from '../../../store/app.state';
import { selectUserById } from '../../../store/users/users.selectors';
import * as UsersActions from '../../../store/users/users.actions';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user/user.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  currentUser = signal<User | null>(null);
  isAdmin = signal(false);

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private store = inject(Store<AppState>);

  constructor() {
    const userId = this.userService.getUserId();
    if (!userId) return;

    const userSignal = this.store.selectSignal(selectUserById(userId));

    effect(() => {
      const user = userSignal();
      if (!user) {
        this.store.dispatch(UsersActions.loadUserById({ userId }));
      }
      this.currentUser.set(user ?? null);
      this.isAdmin.set(!!user && user.userRole?.roleName === 'Admin');
    });
  }

  onLogout(): void {
    this.authService.logout();
  }
}
