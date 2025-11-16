import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState, usersAdapter } from './users.reducer';
import { User } from '../../core/models/user.model';

export const selectUsersState = createFeatureSelector<UsersState>('users');

export const selectAllUsers = createSelector(
  selectUsersState,
  (state: UsersState) =>
    Object.values(state.entities)
      .filter((user) => !!user)
      .map((user) => <User>user)
);

export const selectUsersLoading = createSelector(
  selectUsersState,
  (state) => state.loading
);

export const selectCurrentUser = createSelector(
  selectUsersState,
  (state) => state.currentUser
);

export const selectSelectedUser = createSelector(
  selectUsersState,
  (state) => state.selectedUser
);