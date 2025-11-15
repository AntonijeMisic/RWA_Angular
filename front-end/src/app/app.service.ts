import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as UsersActions from './store/users/users.actions';
import { UserService } from './core/services/user/user.service';

@Injectable({ providedIn: 'root' })
export class AppInitService {
  private store: Store = inject(Store);
  private userService: UserService = inject(UserService);

  initCurrentUser() {
    const userId = this.userService.getUserId();
    if (userId) {
      this.store.dispatch(UsersActions.setCurrentUser({ userId }));
    }
  }
}
