import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as LeaveRequestActions from './leave-requests.actions';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { LeaveRequestService } from '../../core/services/leave-request/leave-request.service';

@Injectable()
export class LeaveRequestEffects {
  private actions$ = inject(Actions);
  private leaveRequestService = inject(LeaveRequestService);

  loadLeaveRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeaveRequestActions.loadLeaveRequests),
      switchMap(() =>
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
      switchMap((action) =>
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
      switchMap(({ userId, start, end }) =>
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
      mergeMap((action) =>
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

  updateLeaveRequestStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeaveRequestActions.updateLeaveRequestStatus),
      mergeMap((action) =>
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