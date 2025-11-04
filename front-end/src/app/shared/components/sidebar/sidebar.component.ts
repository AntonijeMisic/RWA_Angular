import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'] // ispravka styleUrl -> styleUrls
})
export class SidebarComponent implements OnInit {

  isAdmin: boolean = false;
  currentUser!: User; // ili napravi tip User ako postoji interfejs
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    const user = this.authService.getUser()!; // metoda koja vraća ulogovanog korisnika
    this.currentUser = user;

    this.isAdmin = user?.userRole?.roleName === 'Admin';
  }

  onLogout(): void {
    this.authService.logout();
  }
}
