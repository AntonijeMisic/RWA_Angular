import { createAction, props } from '@ngrx/store';
import { Announcement } from '../../core/models/announcement.model';

// Load
export const loadAnnouncements = createAction('[Announcements] Load All');
export const loadAnnouncementsSuccess = createAction(
  '[Announcements] Load All Success',
  props<{ announcements: Announcement[] }>()
);
export const loadAnnouncementsFailure = createAction(
  '[Announcements] Load All Failure',
  props<{ error: any }>()
);

// Create
export const createAnnouncement = createAction(
  '[Announcements] Create',
  props<{ announcement: Partial<Announcement> }>()
);
export const createAnnouncementSuccess = createAction(
  '[Announcements] Create Success',
  props<{ announcement: Announcement }>()
);
export const createAnnouncementFailure = createAction(
  '[Announcements] Create Failure',
  props<{ error: any }>()
);

// Update
export const updateAnnouncement = createAction(
  '[Announcements] Update',
  props<{ announcement: Announcement }>()
);
export const updateAnnouncementSuccess = createAction(
  '[Announcements] Update Success',
  props<{ announcement: Announcement }>()
);
export const updateAnnouncementFailure = createAction(
  '[Announcements] Update Failure',
  props<{ error: any }>()
);

// Delete
export const deleteAnnouncement = createAction(
  '[Announcements] Delete',
  props<{ id: number }>()
);
export const deleteAnnouncementSuccess = createAction(
  '[Announcements] Delete Success',
  props<{ id: number }>()
);
export const deleteAnnouncementFailure = createAction(
  '[Announcements] Delete Failure',
  props<{ error: any }>()
);
