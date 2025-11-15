import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { AppState } from '../../store/app.state';
import { Announcement } from '../../core/models/announcement.model';
import { selectAllAnnouncements } from '../../store/announcements/announcements.selectors';
import * as AnnouncementsActions from '../../store/announcements/announcements.actions';
import { selectCurrentUser } from '../../store/users/users.selectors';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true,
})
export class AnnouncementsComponent implements OnInit {
  private store = inject(Store<AppState>);
  private router = inject(Router);

  announcements$: Observable<Announcement[]> = this.store.select(
    selectAllAnnouncements
  );
  isAdmin = signal(false);

  ngOnInit(): void {
    this.store.dispatch(AnnouncementsActions.loadAnnouncements());

    this.store.select(selectCurrentUser).subscribe((user) => {
      this.isAdmin.set(!!user && user.userRole?.roleName === 'Admin');
    });
  }

  showAnnouncement(ann: Announcement) {
    this.router.navigate(['/home/announcement', ann.announcementId]);
  }

  addAnnouncement() {
    this.router.navigate(['/home/announcement']);
  }

  deleteAnnouncement(ann: Announcement) {
    this.store.dispatch(
      AnnouncementsActions.deleteAnnouncement({ id: ann.announcementId })
    );
  }
}