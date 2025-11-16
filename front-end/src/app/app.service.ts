import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as UsersActions from './store/users/users.actions';
import { UserService } from './core/services/user/user.service';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AppInitService {
  private store: Store = inject(Store);

  initCurrentUser() {
    const userId = Number(localStorage.getItem(environment.userKey));

    if (!isNaN(userId) && userId > 0) {
      this.store.dispatch(UsersActions.setCurrentUser({ userId }));
    }
  }
}
