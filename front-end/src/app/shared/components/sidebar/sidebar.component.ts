import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  onProfileClick(): void {
    console.log('Navigate to profile');
    // this.router.navigate(['/profile']);
  }

  onLogout(): void {
    this.authService.logout();
  }
}
