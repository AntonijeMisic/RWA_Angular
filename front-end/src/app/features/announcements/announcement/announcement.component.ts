import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../core/models/user.model';
import { AppState } from '../../../store/app.state';
import { Store } from '@ngrx/store';
import * as AnnouncementsActions from '../../../store/announcements/announcements.actions';
import { firstValueFrom, take } from 'rxjs';
import { Announcement } from '../../../core/models/announcement.model';
import { selectCurrentUser } from '../../../store/users/users.selectors';
import { Router } from '@angular/router';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css'],
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  standalone: true,
})
export class AnnouncementComponent implements OnInit {
  announcementForm!: FormGroup;
  users: User[] = [];
  isLoading = signal(true);
  announcementNotFound = signal(false);

  private store = inject(Store<AppState>);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  route = inject(ActivatedRoute);

  isAdmin = signal(false);

  ngOnInit(): void {
    this.announcementForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      message: ['', Validators.required],
    });

    this.store.select(selectCurrentUser).subscribe((user) => {
      this.isAdmin.set(!!user && user.userRole?.roleName === 'Admin');

      if (!!user && user.userRole?.roleName !== 'Admin') {
        this.announcementForm.disable();
      } else {
        this.announcementForm.enable();
      }
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.store
        .select((state) => state.announcements.selectedAnnouncement)
        .subscribe((selected) => {
          if (selected && selected.announcementId === id) {
            this.announcementForm.patchValue(selected);
            this.isLoading.set(false);
            this.announcementNotFound.set(false);
          } else if (!selected || selected.announcementId !== id) {
            this.store.dispatch(
              AnnouncementsActions.loadAnnouncementById({ id })
            );
          }
        });

      this.store
        .select((state) => state.announcements.error)
        .subscribe((failed) => {
          if (failed) {
            this.isLoading.set(false);
            this.announcementNotFound.set(true);
          }
        });
    } else {
      this.isLoading.set(false);
    }
  }

  saveAnnouncement() {
    if (this.announcementForm.invalid) {
      this.announcementForm.markAllAsTouched();
      return;
    }

    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.store
      .select(selectCurrentUser)
      .pipe(take(1))
      .subscribe((currentUser) => {
        if (!currentUser) {
          return;
        }

        const formData = this.announcementForm.getRawValue();

        const announcement: Partial<Announcement> = {
          ...formData,
          createdBy: currentUser,
          ...(id ? { announcementId: id } : {}),
        };

        if (id) {
          this.store.dispatch(
            AnnouncementsActions.updateAnnouncement({ announcement })
          );
        } else {
          this.store.dispatch(
            AnnouncementsActions.createAnnouncement({ announcement })
          );
        }

        this.router.navigate(['/home/announcements']);
      });
  }
}