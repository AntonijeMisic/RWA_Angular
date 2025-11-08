import { Component, inject, signal, effect } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';

import { AuthService } from '../../../core/services/auth/auth.service';
import { AppState } from '../../../store/app.state';
import { selectCurrentUser } from '../../../store/users/users.selectors';
import { User } from '../../../core/models/user.model';

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
  private store = inject(Store<AppState>);

  constructor() {
    const currentUserSignal = this.store.selectSignal(selectCurrentUser);

    effect(() => {
      const user = currentUserSignal();
      if(user) {
        this.currentUser.set(user);
        this.isAdmin.set(!!user && user.userRole?.roleName === 'Admin');
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
  }
}