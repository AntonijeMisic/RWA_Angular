import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnnouncementService } from '../../../core/services/announcements/announcements.service';
import { UserService } from '../../../core/services/user/user.service';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/user.model';
import { AppState } from '../../../store/app.state';
import { Store } from '@ngrx/store';
import * as AnnouncementsActions from '../../../store/announcements/announcements.actions';
import { take } from 'rxjs';
import { Announcement } from '../../../core/models/announcement.model';
import { selectCurrentUser } from '../../../store/users/users.selectors';
import { Router } from '@angular/router';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css'],
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  standalone: true
})
export class AnnouncementComponent implements OnInit {
  announcementForm: FormGroup;
  users: User[] = [];

  private store = inject(Store<AppState>);
  private router = inject(Router);

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private announcementService: AnnouncementService
  ) {
    this.announcementForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      message: ['', Validators.required],
      visible_until: [null]
    });
  }

  ngOnInit(): void {
  }


saveAnnouncement() {
  if (this.announcementForm.invalid) {
    this.announcementForm.markAllAsTouched();
    return;
  }

  this.store.select(selectCurrentUser).pipe(take(1)).subscribe(currentUser => {
    if (!currentUser) {
      return;
    }

    const announcement: Partial<Announcement> = {
      ...this.announcementForm.getRawValue(),
      createdBy: currentUser
    };

    this.store.dispatch(AnnouncementsActions.createAnnouncement({ announcement }));
    this.router.navigate(['/home/announcements']);
  });
}
}