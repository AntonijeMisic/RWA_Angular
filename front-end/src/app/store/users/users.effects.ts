import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as UsersActions from './users.actions';
import { UserService } from '../../core/services/user/user.service';
import { catchError, exhaustMap, filter, map, of } from 'rxjs';
import { User } from '../../core/models/user.model';

@Injectable()
export class UsersEffects {

    private actions$ = inject(Actions);
    private userService = inject(UserService);

    loadUsers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UsersActions.loadUsers),
            exhaustMap(() =>
                this.userService.getAllUsers().pipe(
                    map((users) => UsersActions.loadUsersSuccess({ users })),
                    catchError((error) => of(UsersActions.loadUsersFailure({ error })))
                )
            )
        )
    );

    loadUserById$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UsersActions.loadUserById),
            filter(action => action.userId != null),
            exhaustMap(({ userId }) =>
                this.userService.getUserById(userId!).pipe(
                    map(user => UsersActions.loadUserByIdSuccess({ user })),
                    catchError(error => of(UsersActions.loadUserByIdFailure({ error })))
                )
            )
        )
    );

    createUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UsersActions.createUser),
                exhaustMap(({ user }) =>
                this.userService.register(user).pipe(
                    map(savedUser => UsersActions.createUserSuccess({ user: savedUser })),
                    catchError(error => of(UsersActions.createUserFailure({ error })))
                )
            )
        )
    );

    updateUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UsersActions.updateUser),
            exhaustMap(({ user }) =>
                this.userService.update(user).pipe(
                    map(savedUser => UsersActions.updateUserSuccess({ user: savedUser })),
                    catchError(error => of(UsersActions.updateUserFailure({ error })))
                )
            )
        )
    );
    deleteUser$ = createEffect(() =>
        this.actions$.pipe(
        ofType(UsersActions.deleteUser),
            exhaustMap(({ userId }) =>
                    this.userService.deleteUser(userId).pipe(
                    map(() => UsersActions.deleteUserSuccess({ userId })),
                    catchError(error => of(UsersActions.deleteUserFailure({ error })))
                )
            )
        )
    );
}