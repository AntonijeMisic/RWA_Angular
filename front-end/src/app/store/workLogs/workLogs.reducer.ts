import * as WorkLogsActions from './workLogs.actions';
import * as AuthActions from '../auth/auth.actions';
import { WorkLog } from '../../core/models/workLog.model';
import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

export interface WorkLogsState extends EntityState<WorkLog> {
  currentLog: WorkLog | null;
  loading: boolean;
  error: any;
}

export const workLogsAdapter: EntityAdapter<WorkLog> =
  createEntityAdapter<WorkLog>({
    selectId: (log) => log.worklogId,
  });

export const initialWorkLogsState: WorkLogsState =
  workLogsAdapter.getInitialState({
    currentLog: null,
    loading: false,
    error: null,
  });

export const workLogsReducer = createReducer(
  initialWorkLogsState,

  on(WorkLogsActions.loadCurrentWeekLogs, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(WorkLogsActions.loadCurrentWeekLogsSuccess, (state, { logs }) =>
    workLogsAdapter.setAll(logs, { ...state, loading: false, error: null })
  ),
  on(WorkLogsActions.loadCurrentWeekLogsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(WorkLogsActions.loadWorkLogForDate, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(WorkLogsActions.loadWorkLogForDateSuccess, (state, { log }) => ({
    ...state,
    currentLog: log,
    loading: false,
  })),
  on(WorkLogsActions.loadWorkLogForDateFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(WorkLogsActions.clockInSuccess, (state, { log }) => ({
    ...workLogsAdapter.upsertOne(log, state),
    currentLog: log,
  })),

  on(WorkLogsActions.clockOutSuccess, (state, { log }) => ({
    ...workLogsAdapter.updateOne({ id: log.worklogId, changes: log }, state),
    currentLog: log,
  })),

  on(WorkLogsActions.takeBreakSuccess, (state, { log }) => ({
    ...workLogsAdapter.updateOne({ id: log.worklogId, changes: log }, state),
    currentLog: log,
  })),

  on(WorkLogsActions.resumeWorkSuccess, (state, { log }) => ({
    ...workLogsAdapter.updateOne({ id: log.worklogId, changes: log }, state),
    currentLog: log,
  })),

  on(AuthActions.logout, () => initialWorkLogsState)
);