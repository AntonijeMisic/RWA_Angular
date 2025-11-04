import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { authGuard } from './core/guards/auth/auth.guard-guard';
import { redirectGuard } from './core/guards/redirect/redirect.guard-guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AttendanceComponent } from './features/attendance/attendance.component';
import { AnnouncementsComponent } from './features/announcements/announcements.component';
import { VacationScheduleComponent } from './features/vacation-schedule/vacation-schedule.component';
import { UsersListComponent } from './features/users-list/users-list.component';
import { ProfileComponent } from './shared/components/profile/profile.component';
import { RequestsComponent } from './features/requests/requests.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'home',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      // default child = AttendanceComponent
      { path: '', redirectTo: 'attendance', pathMatch: 'full' },
      { path: 'attendance', component: AttendanceComponent },
      { path: 'announcements', component: AnnouncementsComponent },
      { path: 'vacations', component: VacationScheduleComponent },
      { path: 'users', component: UsersListComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'requests', component: RequestsComponent },
      // ostali child routovi
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [redirectGuard],
  }
];

