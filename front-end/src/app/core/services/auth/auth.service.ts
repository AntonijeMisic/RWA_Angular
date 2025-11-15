import { inject, Injectable, signal } from '@angular/core';
import { User } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, {
      email,
      password,
    });
  }

  saveAuthData(userId: number, accessToken: string, refreshToken: string) {
    localStorage.setItem(environment.userKey, JSON.stringify(userId));
    localStorage.setItem(environment.accessTokenKey, accessToken);
    localStorage.setItem(environment.refreshTokenKey, refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(environment.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(environment.refreshTokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  logout(): void {
    const refreshToken = localStorage.getItem('refresh_token');

    if (refreshToken) {
      this.http
        .post(`${environment.apiUrl}/auth/logout`, { refreshToken })
        .subscribe({
          next: () => this.clearAuthData(),
          error: () => this.clearAuthData(),
        });
    } else {
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
