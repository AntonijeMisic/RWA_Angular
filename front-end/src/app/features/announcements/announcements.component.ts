import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';

interface Announcement {
  title: string;
  message: string;
  date: string;
  createdBy?: string;
}

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class AnnouncementsComponent implements OnInit {

  authService = inject(AuthService);
  announcements: Announcement[] = [];
  isAdmin: boolean = false;

  constructor() {}

  ngOnInit(): void {
    const role = this.authService.getUserRole();
    this.isAdmin = role?.roleName === 'Admin';

    this.announcements = [
      { title: 'Team Building Event', message: 'Join us for our annual team-building retreat next Friday at Avala Resort! All expenses covered.', date: '02 Nov 2025' },
      { title: 'New Office Opening', message: 'We’re expanding! A new branch will open in Novi Sad next month. Check the intranet for details.', date: '30 Oct 2025' },
      { title: 'Holiday Schedule', message: 'Please check your calendars for updated national holidays and submit vacation requests early.', date: '28 Oct 2025' }
    ];
  }

  editAnnouncement(ann: Announcement) {
    console.log('Edit announcement', ann);
  }

  deleteAnnouncement(ann: Announcement) {
    console.log('Delete announcement', ann);
  }

  addAnnouncement() {
    console.log('Add Announcement clicked');
  }
}