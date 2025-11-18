import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as UsersActions from './users.actions';
import { UserService } from '../../core/services/user/user.service';
import { catchError, filter, map, mergeMap, switchMap, of, tap } from 'rxjs';

@Injectable()
export class UsersEffects {
  private actions$ = inject(Actions);
  private userService = inject(UserService);

  setCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.setCurrentUser),
      switchMap(({ userId }) =>
        userId != null
          ? this.userService.getUserById(userId).pipe(
              switchMap((user) =>
                user
                  ? of(UsersActions.setCurrentUserSuccess({ user }))
                  : of(
                      UsersActions.setCurrentUserFailure({
                        error: 'User not found',
                      })
                    )
              ),
              catchError((error) =>
                of(UsersActions.setCurrentUserFailure({ error }))
              )
            )
          : of(
              UsersActions.setCurrentUserFailure({
                error: 'No userId provided',
              })
            )
      )
    )
  );

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      switchMap((action) =>
        this.userService.getAllUsers(action.filter ?? {}).pipe(
          map((users) => UsersActions.loadUsersSuccess({ users })),
          catchError((error) => of(UsersActions.loadUsersFailure({ error })))
        )
      )
    )
  );

  loadUserById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUserById),
      switchMap(({ userId }) =>
        userId != null
          ? this.userService.getUserById(userId).pipe(
              switchMap((user) =>
                user
                  ? of(UsersActions.loadUserByIdSuccess({ user }))
                  : of(
                      UsersActions.loadUserByIdFailure({
                        error: 'User not found',
                      })
                    )
              ),
              catchError((error) =>
                of(UsersActions.loadUserByIdFailure({ error }))
              )
            )
          : of(
              UsersActions.loadUserByIdFailure({
                error: 'No userId provided',
              })
            )
      )
    )
  );

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.createUser),
      mergeMap(({ user }) =>
        this.userService.register(user).pipe(
          map((savedUser) =>
            UsersActions.createUserSuccess({ user: savedUser })
          ),
          catchError((error) => of(UsersActions.createUserFailure({ error })))
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUser),
      mergeMap(({ user }) =>
        this.userService.update(user).pipe(
          map((savedUser) =>
            UsersActions.updateUserSuccess({ user: savedUser })
          ),
          catchError((error) => of(UsersActions.updateUserFailure({ error })))
        )
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.deleteUser),
      mergeMap(({ userId }) =>
        this.userService.deleteUser(userId).pipe(
          map(() => UsersActions.deleteUserSuccess({ userId })),
          catchError((error) => of(UsersActions.deleteUserFailure({ error })))
        )
      )
    )
  );
}
