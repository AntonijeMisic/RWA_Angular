import { createReducer, on } from '@ngrx/store';
import * as AnnouncementsActions from './announcements.actions';
import { Announcement } from '../../core/models/announcement.model';

export interface AnnouncementsState {
  announcements: Announcement[];
  selectedAnnouncement: Announcement | null;
  loading: boolean;
  error: any;
}

export const initialState: AnnouncementsState = {
  announcements: [],
  selectedAnnouncement: null,
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
  on(AnnouncementsActions.loadAnnouncementById, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AnnouncementsActions.loadAnnouncementByIdSuccess, (state, { announcement }) => ({
    ...state,
    loading: false,
    selectedAnnouncement: announcement
  })),

  on(AnnouncementsActions.loadAnnouncementByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
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
    selectedAnnouncement: state.selectedAnnouncement?.announcementId === announcement.announcementId
        ? announcement
        : state.selectedAnnouncement
  })),
  on(AnnouncementsActions.deleteAnnouncementSuccess, (state, { id }) => ({
    ...state,
    announcements: state.announcements.filter(a => a.announcementId !== id),
    selectedAnnouncement: state.selectedAnnouncement?.announcementId === id ? null : state.selectedAnnouncement
  }))
);
