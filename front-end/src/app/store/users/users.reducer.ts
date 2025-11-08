import { createReducer, on } from '@ngrx/store';
import * as UsersActions from './users.actions';
import { User } from '../../core/models/user.model';

export interface UsersState {
  users: User[];
  loading: boolean;
  error: any;
  selectedUser?: User | null;
}

export const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  selectedUser: null
};

export const usersReducer = createReducer(
  initialState,

  // --- Load all users ---
  on(UsersActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UsersActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false
  })),
  on(UsersActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // --- Load single user by id ---
  on(UsersActions.loadUserById, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UsersActions.loadUserByIdSuccess, (state, { user }) => ({
    ...state,
    users: [
      ...state.users.filter(u => u.userId !== user.userId), // delete old version if  exists
      user // add/ update with new one
    ],
    loading: false
  })),
  on(UsersActions.loadUserByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // --- Create user ---
  on(UsersActions.createUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UsersActions.createUserSuccess, (state, { user }) => ({
    ...state,
    users: [...state.users, user],
    loading: false
  })),
  on(UsersActions.createUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // --- Update user ---
  on(UsersActions.updateUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UsersActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map(u => u.userId === user.userId ? user : u),
    loading: false
  })),
  on(UsersActions.updateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  // Delete user
  on(UsersActions.deleteUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UsersActions.deleteUserSuccess, (state, { userId }) => ({
    ...state,
    users: state.users.filter(u => u.userId !== userId),
    loading: false
  })),
  on(UsersActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
);