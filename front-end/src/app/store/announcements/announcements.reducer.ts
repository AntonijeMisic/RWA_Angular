import * as AnnouncementsActions from './announcements.actions';
import * as AuthActions from '../auth/auth.actions';
import { Announcement } from '../../core/models/announcement.model';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

export interface AnnouncementsState extends EntityState<Announcement> {
  selectedAnnouncement: Announcement | null;
  loading: boolean;
  error: any;
}

export const announcementsAdapter: EntityAdapter<Announcement> =
  createEntityAdapter<Announcement>({
    selectId: (announcement) => announcement.announcementId,
  });

export const initialState: AnnouncementsState =
  announcementsAdapter.getInitialState({
    selectedAnnouncement: null,
    loading: false,
    error: null,
  });

export const announcementsReducer = createReducer(
  initialState,

  on(AnnouncementsActions.loadAnnouncements, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(
    AnnouncementsActions.loadAnnouncementsSuccess,
    (state, { announcements }) =>
      announcementsAdapter.setAll(announcements, { ...state, loading: false })
  ),
  on(AnnouncementsActions.loadAnnouncementsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AnnouncementsActions.loadAnnouncementById, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(
    AnnouncementsActions.loadAnnouncementByIdSuccess,
    (state, { announcement }) => ({
      ...state,
      loading: false,
      selectedAnnouncement: announcement,
    })
  ),
  on(AnnouncementsActions.loadAnnouncementByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    selectedAnnouncement: null,
    error,
  })),

  on(
    AnnouncementsActions.createAnnouncementSuccess,
    (state, { announcement }) =>
      announcementsAdapter.addOne(announcement, state)
  ),

  on(
    AnnouncementsActions.updateAnnouncementSuccess,
    (state, { announcement }) =>
      announcementsAdapter.updateOne(
        { id: announcement.announcementId, changes: announcement },
        {
          ...state,
          selectedAnnouncement:
            state.selectedAnnouncement?.announcementId ===
            announcement.announcementId
              ? announcement
              : state.selectedAnnouncement,
        }
      )
  ),

  on(AnnouncementsActions.deleteAnnouncementSuccess, (state, { id }) =>
    announcementsAdapter.removeOne(id, {
      ...state,
      selectedAnnouncement:
        state.selectedAnnouncement?.announcementId === id
          ? null
          : state.selectedAnnouncement,
    })
  ),

  on(AuthActions.logout, () => initialState)
);