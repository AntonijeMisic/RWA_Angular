import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as WorkLogsActions from './workLogs.actions';
import { catchError, map, exhaustMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { WorkLogService } from '../../core/services/workLog/workLog.service';

@Injectable()
export class WorkLogsEffects {
  private actions$ = inject(Actions);
  private workLogService = inject(WorkLogService);

  loadCurrentWeek$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkLogsActions.loadCurrentWeekLogs),
      exhaustMap((action) =>
        this.workLogService.getCurrentWeekLogs(action.userId).pipe(
          map((logs) => WorkLogsActions.loadCurrentWeekLogsSuccess({ logs })),
          catchError((error) =>
            of(WorkLogsActions.loadCurrentWeekLogsFailure({ error }))
          )
        )
      )
    )
  );

  loadWorkLogForDate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkLogsActions.loadWorkLogForDate),
      exhaustMap(({ userId, date }) =>
        this.workLogService.getCurrentLog(userId, date).pipe(
          map((log) => WorkLogsActions.loadWorkLogForDateSuccess({ log })),
          catchError((error) =>
            of(WorkLogsActions.loadWorkLogForDateFailure({ error }))
          )
        )
      )
    )
  );

  clockIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkLogsActions.clockIn),
      exhaustMap((action) =>
        this.workLogService.clockIn(action.userId, action.workTypeId).pipe(
          map((log) => WorkLogsActions.clockInSuccess({ log })),
          catchError((error) => of(WorkLogsActions.clockInFailure({ error })))
        )
      )
    )
  );

  clockOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkLogsActions.clockOut),
      exhaustMap((action) =>
        this.workLogService.clockOut(action.userId).pipe(
          map((log) => WorkLogsActions.clockOutSuccess({ log })),
          catchError((error) => of(WorkLogsActions.clockOutFailure({ error })))
        )
      )
    )
  );

  takeBreak$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkLogsActions.takeBreak),
      exhaustMap((action) =>
        this.workLogService.takeBreak(action.userId).pipe(
          tap((worklog) => console.log(worklog)),
          map((log) => WorkLogsActions.takeBreakSuccess({ log })),
          catchError((error) => of(WorkLogsActions.takeBreakFailure({ error })))
        )
      )
    )
  );

  resumeWork$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkLogsActions.resumeWork),
      exhaustMap((action) =>
        this.workLogService.resumeWork(action.userId).pipe(
          tap((worklog) => console.log('Resume work returned:', worklog)),
          map((log) => WorkLogsActions.resumeWorkSuccess({ log })),
          catchError((error) =>
            of(WorkLogsActions.resumeWorkFailure({ error }))
          )
        )
      )
    )
  );
}
