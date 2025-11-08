import { createReducer, on } from '@ngrx/store';
import * as AnnouncementsActions from './announcements.actions';
import { Announcement } from '../../core/models/announcement.model';

export interface AnnouncementsState {
  announcements: Announcement[];
  loading: boolean;
  error: any;
}

export const initialState: AnnouncementsState = {
  announcements: [],
  loading: false,
  error: null,
};

export const announcementsReducer = createReducer(
  initialState,

  on(AnnouncementsActions.loadAnnouncements, state => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AnnouncementsActions.loadAnnouncementsSuccess, (state, { announcements }) => ({
    ...state,
    announcements,
    loading: false,
  })),
  on(AnnouncementsActions.loadAnnouncementsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AnnouncementsActions.createAnnouncementSuccess, (state, { announcement }) => ({
    ...state,
    announcements: [...state.announcements, announcement],
  })),

  on(AnnouncementsActions.updateAnnouncementSuccess, (state, { announcement }) => ({
    ...state,
    announcements: state.announcements.map(a =>
      a.announcementId === announcement.announcementId ? announcement : a
    ),
  })),

  on(AnnouncementsActions.deleteAnnouncementSuccess, (state, { id }) => ({
    ...state,
    announcements: state.announcements.filter(a => a.announcementId !== id),
  }))
);
