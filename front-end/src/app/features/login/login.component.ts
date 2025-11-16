import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as UsersActions from '../../store/users/users.actions';
import { AppState } from '../../store/app.state';

export interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login.component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  store: Store<AppState> = inject(Store<AppState>);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  loginForm: FormGroup<LoginForm>;
  errorMessage: string | null = null;

  constructor() {
    this.loginForm = new FormGroup<LoginForm>({
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const loginData = this.loginForm.getRawValue();
    this.authService.login(loginData.email, loginData.password).subscribe({
      next: (res) => {
        this.authService.saveAuthData(
          res.user.userId!,
          res.access_token,
          res.refresh_token
        );
        this.store.dispatch(
          UsersActions.setCurrentUser({ userId: res.user.userId! })
        );
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed';
      },
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
