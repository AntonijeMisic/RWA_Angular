import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { environment } from '../../../../environments/environment';
import { AppState } from '../../../store/app.state';
import { Store } from '@ngrx/store';
import { UserRole } from '../../models/lookups.model';
import { UserFilterDto } from '../../dtos/userFilter.dto.';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private store = inject(Store<AppState>);

  currentUserRole = signal<UserRole | null>(null);

  register(user: User): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/auth/register`, user);
  }

  update(user: User): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users/update`, user, {});
  }

  getUserId(): number | null {
    const userId = localStorage.getItem(environment.userKey);
    return userId ? Number(userId) : null;
  }

  getAllUsers(filter?: Partial<UserFilterDto>): Observable<User[]> {
    let params = new HttpParams();
    if (filter) {
      if (filter.firstName) params = params.set('firstName', filter.firstName);
      if (filter.lastName) params = params.set('lastName', filter.lastName);
      if (filter.email) params = params.set('email', filter.email);
      if (filter.userRoleId)
        params = params.set('userRoleId', filter.userRoleId.toString());
      if (filter.userPositionId)
        params = params.set('userPositionId', filter.userPositionId.toString());
    }

    return this.http.get<User[]>(`${environment.apiUrl}/users`, {
      params,
    });
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/users/${userId}`);
  }
}
