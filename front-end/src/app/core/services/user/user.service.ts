import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { environment } from '../../../../environments/environment';
import { UserFilterDto } from '../../dtos/dtos';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  register(user: User): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/auth/register`, user);
  }

  update(user: User): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users/update`, user, {});
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