import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { UserRole } from '../../models/lookups.model';

interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    console.log('Attempting login for:', email);
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, {
      email,
      password,
    });
  }

  saveAuthData(user: User, accessToken: string, refreshToken: string) {
    console.log('Saving auth data for user:', user);
    localStorage.setItem(environment.userKey, JSON.stringify(user));
    localStorage.setItem(environment.accessTokenKey, accessToken);
    localStorage.setItem(environment.refreshTokenKey, refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(environment.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(environment.refreshTokenKey);
  }

  getUser(): User | null {
    const userJson = localStorage.getItem(environment.userKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  getUserRole(): UserRole | null {
    const user = this.getUser();
    console.log('Retrieved user for role check:', user);
    return user?.userRole ?? null;
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  logout(): void {
    const refreshToken = localStorage.getItem('refresh_token');

    if (refreshToken) {
      this.http.post(`${environment.apiUrl}/auth/logout`, { refreshToken }).subscribe({
        next: () => this.clearAuthData(),
        error: () => this.clearAuthData(),
      });
    }
    else {
      this.clearAuthData();
    }
  }

  private clearAuthData(): void {
    localStorage.removeItem(environment.userKey);
    localStorage.removeItem(environment.accessTokenKey);
    localStorage.removeItem(environment.refreshTokenKey);
    this.router.navigate(['/login']);
  }
}
