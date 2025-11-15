import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as LeaveRequestActions from './leave-requests.actions';
import { catchError, exhaustMap, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { LeaveRequestService } from '../../core/services/leave-request/leave-request.service';

@Injectable()
export class LeaveRequestEffects {
  private actions$ = inject(Actions);
  private leaveRequestService: LeaveRequestService =
    inject(LeaveRequestService);

  loadLeaveRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeaveRequestActions.loadLeaveRequests),
      exhaustMap(() =>
        this.leaveRequestService.getRequests().pipe(
          map((leaveRequests) =>
            LeaveRequestActions.loadLeaveRequestsSuccess({ leaveRequests })
          ),
          catchError((error) =>
            of(LeaveRequestActions.loadLeaveRequestsFailure({ error }))
          )
        )
      )
    )
  );

  loadUserLeaveRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeaveRequestActions.loadUserLeaveRequests),
      exhaustMap((action) =>
        this.leaveRequestService.getRequestsByUser(action.userId).pipe(
          map((leaveRequestsByUser) =>
            LeaveRequestActions.loadUserLeaveRequestsSuccess({
              leaveRequestsByUser,
            })
          ),
          catchError((error) =>
            of(LeaveRequestActions.loadUserLeaveRequestsFailure({ error }))
          )
        )
      )
    )
  );

  loadApprovedLeavesForWeek$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeaveRequestActions.loadApprovedLeavesForWeek),
      exhaustMap(({ userId, start, end }) =>
        this.leaveRequestService
          .getApprovedLeavesForWeek(userId, start, end)
          .pipe(
            map((leaves) =>
              LeaveRequestActions.loadApprovedLeavesForWeekSuccess({ leaves })
            ),
            catchError((err) =>
              of(
                LeaveRequestActions.loadApprovedLeavesForWeekFailure({
                  error: err.message,
                })
              )
            )
          )
      )
    )
  );

  createLeaveRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeaveRequestActions.createLeaveRequest),
      exhaustMap((action) =>
        this.leaveRequestService.createLeaveRequest(action.dto).pipe(
          map((leaveRequest) =>
            LeaveRequestActions.createLeaveRequestSuccess({ leaveRequest })
          ),
          catchError((error) =>
            of(LeaveRequestActions.createLeaveRequestFailure({ error }))
          )
        )
      )
    )
  );

  deleteLeaveRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeaveRequestActions.deleteLeaveRequest),
      exhaustMap((action) =>
        this.leaveRequestService.deleteRequest(action.requestId).pipe(
          map(() =>
            LeaveRequestActions.deleteLeaveRequestSuccess({
              requestId: action.requestId,
            })
          ),
          catchError((error) =>
            of(LeaveRequestActions.deleteLeaveRequestFailure({ error }))
          )
        )
      )
    )
  );

  updateLeaveRequestStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeaveRequestActions.updateLeaveRequestStatus),
      exhaustMap((action) =>
        this.leaveRequestService.updateStatus(action.dto).pipe(
          map((leaveRequest) =>
            LeaveRequestActions.updateLeaveRequestStatusSuccess({
              leaveRequest,
            })
          ),
          catchError((error) =>
            of(LeaveRequestActions.updateLeaveRequestStatusFailure({ error }))
          )
        )
      )
    )
  );
}
