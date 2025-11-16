import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AnnouncementsState } from './announcements.reducer';
import { Announcement } from '../../core/models/announcement.model';

export const selectAnnouncementsState =
  createFeatureSelector<AnnouncementsState>('announcements');

export const selectAllAnnouncements = createSelector(
  selectAnnouncementsState,
  (state: AnnouncementsState) =>
    Object.values(state.entities)
      .filter((ann) => !!ann)
      .map((ann) => <Announcement>ann)
);

export const selectAnnouncementsLoading = createSelector(
  selectAnnouncementsState,
  (state) => state.loading
);

export const selectSelectedAnnouncement = createSelector(
  selectAnnouncementsState,
  (state: AnnouncementsState) => state.selectedAnnouncement
);
