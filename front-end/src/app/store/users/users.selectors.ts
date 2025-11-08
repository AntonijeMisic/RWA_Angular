import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState } from './users.reducer';

export const selectUsersState = createFeatureSelector<UsersState>('users');

export const selectAllUsers = createSelector(selectUsersState, (state) => state.users);
export const selectUsersLoading = createSelector(selectUsersState, (state) => state.loading);
export const selectSelectedUser = createSelector(
  selectUsersState,
  (state) => state.selectedUser
);
export const selectUserById = (id: number | null) =>
  createSelector(selectAllUsers, users => users.find(u => u.userId === id));