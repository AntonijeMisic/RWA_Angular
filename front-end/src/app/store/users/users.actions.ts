import { createAction, props } from '@ngrx/store';
import { User } from '../../core/models/user.model';

export const loadUsers = createAction('[Users] Load Users');
export const loadUsersSuccess = createAction('[Users] Load Users Success', props<{ users: User[] }>());
export const loadUsersFailure = createAction('[Users] Load Users Failure', props<{ error: any }>()); // ne znam da li ce error biti any ili neki specificniji tip

export const loadUserById = createAction(
  '[Users] Load User By Id',
  props<{ userId: number | null }>()
);

export const loadUserByIdSuccess = createAction(
  '[Users] Load User By Id Success',
  props<{ user: User }>()
);

export const loadUserByIdFailure = createAction(
  '[Users] Load User By Id Failure',
  props<{ error: any }>()
);

// CREATE
export const createUser = createAction(
  '[Users] Create User',
  props<{ user: User }>()
);
export const createUserSuccess = createAction(
  '[Users] Create User Success',
  props<{ user: User }>()
);
export const createUserFailure = createAction(
  '[Users] Create User Failure',
  props<{ error: any }>()
);

// UPDATE
export const updateUser = createAction(
  '[Users] Update User',
  props<{ user: User }>()
);
export const updateUserSuccess = createAction(
  '[Users] Update User Success',
  props<{ user: User }>()
);
export const updateUserFailure = createAction(
  '[Users] Update User Failure',
  props<{ error: any }>()
);

// DELETE
export const deleteUser = createAction(
  '[Users] Delete User',
  props<{ userId: number }>()
);

export const deleteUserSuccess = createAction(
  '[Users] Delete User Success',
  props<{ userId: number }>()
);

export const deleteUserFailure = createAction(
  '[Users] Delete User Failure',
  props<{ error: any }>()
);