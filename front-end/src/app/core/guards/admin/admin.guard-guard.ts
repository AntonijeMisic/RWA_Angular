import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { AppState } from '../../../store/app.state';
import { selectCurrentUser } from '../../../store/users/users.selectors';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  private store = inject(Store<AppState>);
  private router = inject(Router);

  canActivate() {
    return this.store.select(selectCurrentUser).pipe(
      take(1),
      map(user => {
        if (user && user.userRole.roleName?.toLowerCase() === 'admin') {
          return true;
        } else {
          this.router.navigate(['/home/announcements']);
          return false;
        }
      })
    );
  }
}
