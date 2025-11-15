import { createReducer, on } from '@ngrx/store';
import * as UsersActions from './users.actions';
import * as AuthActions from '../auth/auth.actions';
import { User } from '../../core/models/user.model';

export interface UsersState {
  users: User[];
  loading: boolean;
  error: any;
  selectedUser?: User | null;
  currentUser?: User | null;
}

export const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  selectedUser: null,
  currentUser: null
};

export const usersReducer = createReducer(
  initialState,

  on(UsersActions.setCurrentUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UsersActions.setCurrentUserSuccess, (state, { user }) => ({
    ...state,
    currentUser: user,
    users: state.users.map(u => u.userId === user.userId ? user : u),
    loading: false
  })),
  on(UsersActions.setCurrentUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(UsersActions.updateCurrentUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UsersActions.updateCurrentUserSuccess, (state, { user }) => ({
    ...state,
    currentUser: user,
    users: state.users.map(u => u.userId === user.userId ? user : u),
    loading: false
  })),
  on(UsersActions.updateCurrentUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
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
    selectedUser: user,
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
  on(UsersActions.updateUserSuccess, (state, { user }) => {
    // Update user u users listi
    const updatedUsers = state.users.map(u => u.userId === user.userId ? user : u);

    // Ažuriraj selectedUser i currentUser ako su isti kao taj user
    const updatedSelectedUser = state.selectedUser && state.selectedUser.userId === user.userId ? user : state.selectedUser;
    const updatedCurrentUser = state.currentUser && state.currentUser.userId === user.userId ? user : state.currentUser;

    return {
      ...state,
      users: updatedUsers,
      selectedUser: updatedSelectedUser,
      currentUser: updatedCurrentUser,
      loading: false
    };
  }),
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
    selectedUser: state.selectedUser?.userId === userId ? null : state.selectedUser,
    loading: false
  })),
  on(UsersActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AuthActions.logout, () => initialState)
);