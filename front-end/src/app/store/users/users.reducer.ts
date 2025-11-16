import { createReducer, on } from '@ngrx/store';
import * as UsersActions from './users.actions';
import * as AuthActions from '../auth/auth.actions';
import { User } from '../../core/models/user.model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

export interface UsersState extends EntityState<User> {
  loading: boolean;
  error: any;
  selectedUser: User | null;
  currentUser: User | null;
}

export const usersAdapter: EntityAdapter<User> = createEntityAdapter<User>({
  selectId: (user) => user.userId!,
});

export const initialState: UsersState = usersAdapter.getInitialState({
  loading: false,
  error: null,
  selectedUser: null,
  currentUser: null,
});

export const usersReducer = createReducer(
  initialState,

  on(UsersActions.setCurrentUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UsersActions.setCurrentUserSuccess, (state, { user }) => {
    const updated = usersAdapter.upsertOne(user, state);
    return {
      ...updated,
      currentUser: user,
      loading: false,
    };
  }),

  on(UsersActions.setCurrentUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UsersActions.updateCurrentUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UsersActions.updateCurrentUserSuccess, (state, { user }) => {
    const updated = usersAdapter.upsertOne(user, state);
    return {
      ...updated,
      currentUser: user,
      loading: false,
    };
  }),

  on(UsersActions.updateCurrentUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UsersActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UsersActions.loadUsersSuccess, (state, { users }) =>
    usersAdapter.setAll(users, { ...state, loading: false })
  ),

  on(UsersActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UsersActions.loadUserById, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UsersActions.loadUserByIdSuccess, (state, { user }) => {
    const updated = usersAdapter.upsertOne(user, state);

    return {
      ...updated,
      selectedUser: user,
      loading: false,
    };
  }),

  on(UsersActions.loadUserByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UsersActions.createUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UsersActions.createUserSuccess, (state, { user }) =>
    usersAdapter.addOne(user, { ...state, loading: false })
  ),

  on(UsersActions.createUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UsersActions.updateUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UsersActions.updateUserSuccess, (state, { user }) => {
    const updatedState = usersAdapter.upsertOne(user, state);

    return {
      ...updatedState,
      selectedUser:
        state.selectedUser?.userId === user.userId ? user : state.selectedUser,
      currentUser:
        state.currentUser?.userId === user.userId ? user : state.currentUser,
      loading: false,
    };
  }),

  on(UsersActions.updateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(UsersActions.deleteUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UsersActions.deleteUserSuccess, (state, { userId }) => {
    const updatedState = usersAdapter.removeOne(userId, state);

    return {
      ...updatedState,
      selectedUser:
        state.selectedUser?.userId === userId ? null : state.selectedUser,
      loading: false,
    };
  }),

  on(UsersActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AuthActions.logout, () => initialState)
);