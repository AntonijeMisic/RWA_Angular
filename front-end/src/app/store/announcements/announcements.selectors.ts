import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AnnouncementsState } from './announcements.reducer';

export const selectAnnouncementsState =
  createFeatureSelector<AnnouncementsState>('announcements');

export const selectAllAnnouncements = createSelector(
  selectAnnouncementsState,
  state => state.announcements
);

export const selectAnnouncementsLoading = createSelector(
  selectAnnouncementsState,
  state => state.loading
);

export const selectSelectedAnnouncement = createSelector(
  selectAnnouncementsState,
  (state: AnnouncementsState) => state.selectedAnnouncement
);
