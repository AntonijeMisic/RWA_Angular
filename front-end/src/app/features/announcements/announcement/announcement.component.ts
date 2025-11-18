import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '../../../store/app.state';
import { Store } from '@ngrx/store';
import * as AnnouncementsActions from '../../../store/announcements/announcements.actions';
import { combineLatest, take } from 'rxjs';
import { Announcement } from '../../../core/models/announcement.model';
import { selectCurrentUser } from '../../../store/users/users.selectors';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface AnnouncementForm {
  title: FormControl<string>;
  message: FormControl<string>;
}

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css'],
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  standalone: true,
})
export class AnnouncementComponent implements OnInit {

  announcementForm!: FormGroup<AnnouncementForm>;
  store = inject(Store<AppState>);
  router = inject(Router);
  route = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);

  isAdmin = signal(false);
  isLoading = signal(true);
  announcementNotFound = signal(false);

  ngOnInit(): void {
    this.announcementForm = new FormGroup<AnnouncementForm>({
      title: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(200)],
      }),
      message: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));

    combineLatest([
      this.store.select(selectCurrentUser),
      this.store.select((state) => state.announcements.selectedAnnouncement),
      this.store.select((state) => state.announcements.error),
    ])
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(([user, selected, error]) => {
      this.isAdmin.set(!!user && user.userRole?.roleName === 'Admin');
      if (!this.isAdmin()) {
        this.announcementForm.disable();
      } else {
        this.announcementForm.enable();
      }

      if (id) {
        if (selected && selected.announcementId === id) {
          this.announcementForm.patchValue(selected);
          this.isLoading.set(false);
          this.announcementNotFound.set(false);
        } else {
          this.store.dispatch(
            AnnouncementsActions.loadAnnouncementById({ id: id })
          );
        }

        if (error) {
          this.isLoading.set(false);
          this.announcementNotFound.set(true);
        }
      } else {
        this.isLoading.set(false);
      }
    });
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