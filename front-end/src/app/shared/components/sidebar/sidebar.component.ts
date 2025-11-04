import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  isAdmin: boolean = false;
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    const role = this.authService.getUserRole();
    this.isAdmin = role?.roleName === 'Admin';
  }

  onLogout(): void {
    this.authService.logout();
  }
}
