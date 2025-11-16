import { Component, inject, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';

import { AuthService } from '../../../core/services/auth/auth.service';
import { AppState } from '../../../store/app.state';
import { selectCurrentUser } from '../../../store/users/users.selectors';
import * as AuthActions from '../../../store/auth/auth.actions';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  private store = inject(Store<AppState>);
  private authService = inject(AuthService);

  currentUser = this.store.selectSignal(selectCurrentUser);

  isAdmin = computed(() => this.currentUser()?.userRole?.roleName === 'Admin');

  onLogout(): void {
    this.store.dispatch(AuthActions.logout());
    this.authService.logout();
  }
}