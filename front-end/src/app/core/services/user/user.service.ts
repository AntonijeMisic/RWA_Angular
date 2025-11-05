import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  register(user: User): Observable<User> {
    const token = localStorage.getItem(environment.accessTokenKey);
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

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/all`);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/${id}`);
  }
}
