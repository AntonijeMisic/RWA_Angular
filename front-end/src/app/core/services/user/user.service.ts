import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, take, tap } from 'rxjs';
import { User } from '../../models/user.model';
import { environment } from '../../../../environments/environment';
import { AppState } from '../../../store/app.state';
import { Store } from '@ngrx/store';
import * as UsersActions from '../../../store/users/users.actions';
import { selectUserById } from '../../../store/users/users.selectors';
import { UserRole } from '../../models/lookups.model';
import { UserFilterDto } from '../../dtos/userFilter.dto.';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  private store = inject(Store<AppState>);

  currentUserRole = signal<UserRole | null>(null);

  register(user: User): Observable<User> {
    const token = localStorage.getItem(environment.accessTokenKey); //dodaj interceptor za auth
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<User>(`${environment.apiUrl}/auth/register`, user, { headers });
  }

  update(user: User): Observable<User> {
    const token = localStorage.getItem(environment.accessTokenKey);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<User>(`${environment.apiUrl}/users/update`, user, { headers });
  }

  getUserId(): number | null {
    const userId = localStorage.getItem(environment.userKey);
    return userId ? Number(userId) : null;
  }

  getUserRole(): UserRole | null {
    const userId = this.getUserId();
    this.store.select(selectUserById(userId))
      .pipe(
        take(1),
        tap(user => {
          if (!user) {
            this.store.dispatch(UsersActions.loadUserById({ userId }));
          }
        }),
        map(user => user?.userRole ?? null)
      )
      .subscribe(role => this.currentUserRole.set(role));

    return this.currentUserRole();
  }

  getAllUsers(filter?: Partial<UserFilterDto>): Observable<User[]> {
    const token = localStorage.getItem(environment.accessTokenKey);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let params = new HttpParams();
    if (filter) {
      if (filter.firstName) params = params.set('firstName', filter.firstName);
      if (filter.lastName) params = params.set('lastName', filter.lastName);
      if (filter.email) params = params.set('email', filter.email);
      if (filter.userRoleId) params = params.set('userRoleId', filter.userRoleId.toString());
      if (filter.userPositionId) params = params.set('userPositionId', filter.userPositionId.toString());
    }

    return this.http.get<User[]>(`${environment.apiUrl}/users`, { headers, params });
  }

  getUserById(id: number): Observable<User> {
    const token = localStorage.getItem(environment.accessTokenKey);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`, { headers });
  }

  deleteUser(userId: number): Observable<void> {
    const token = localStorage.getItem(environment.accessTokenKey);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<void>(`${environment.apiUrl}/users/${userId}`, {headers});
  }
}
