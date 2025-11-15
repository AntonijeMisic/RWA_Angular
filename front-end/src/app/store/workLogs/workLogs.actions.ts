import { createAction, props } from '@ngrx/store';
import { WorkLog } from '../../core/models/workLog.model';

export const loadCurrentWeekLogs = createAction(
  '[WorkLogs] Load Current Week Logs',
  props<{ userId: number }>()
);

export const loadCurrentWeekLogsSuccess = createAction(
  '[WorkLogs] Load Current Week Logs Success',
  props<{ logs: WorkLog[] }>()
);

export const loadCurrentWeekLogsFailure = createAction(
  '[WorkLogs] Load Current Week Logs Failure',
  props<{ error: any }>()
);

export const loadWorkLogForDate = createAction(
  '[WorkLogs] Load WorkLog For Date',
  props<{ userId: number; date: string }>()
);

export const loadWorkLogForDateSuccess = createAction(
  '[WorkLogs] Load WorkLog For Date Success',
  props<{ log: WorkLog | null }>()
);

export const loadWorkLogForDateFailure = createAction(
  '[WorkLogs] Load WorkLog For Date Failure',
  props<{ error: any }>()
);

export const clockIn = createAction(
  '[WorkLogs] Clock In',
  props<{ userId: number; workTypeId?: number }>()
);

export const clockInSuccess = createAction(
  '[WorkLogs] Clock In Success',
  props<{ log: WorkLog }>()
);

export const clockInFailure = createAction(
  '[WorkLogs] Clock In Failure',
  props<{ error: any }>()
);

export const clockOut = createAction(
  '[WorkLogs] Clock Out',
  props<{ userId: number }>()
);

export const clockOutSuccess = createAction(
  '[WorkLogs] Clock Out Success',
  props<{ log: WorkLog }>()
);

export const clockOutFailure = createAction(
  '[WorkLogs] Clock Out Failure',
  props<{ error: any }>()
);

export const takeBreak = createAction(
  '[WorkLogs] Take Break',
  props<{ userId: number }>()
);

export const takeBreakSuccess = createAction(
  '[WorkLogs] Take Break Success',
  props<{ log: WorkLog }>()
);

export const takeBreakFailure = createAction(
  '[WorkLogs] Take Break Failure',
  props<{ error: any }>()
);

export const resumeWork = createAction(
  '[WorkLogs] Resume Work',
  props<{ userId: number }>()
);

export const resumeWorkSuccess = createAction(
  '[WorkLogs] Resume Work Success',
  props<{ log: WorkLog }>()
);

export const resumeWorkFailure = createAction(
  '[WorkLogs] Resume Work Failure',
  props<{ error: any }>()
);
