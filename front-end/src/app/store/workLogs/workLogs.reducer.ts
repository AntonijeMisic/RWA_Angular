import { createReducer, on } from "@ngrx/store";
import { WorkLog } from "../../core/models/workLog.model";
import * as WorkLogsActions from './workLogs.actions';
import * as AuthActions from '../auth/auth.actions';

export interface WorkLogsState {
  allLogs: WorkLog[];
  currentLog: WorkLog | null;
  loading: boolean;
  error: any;
}

export const initialWorkLogsState: WorkLogsState = {
  allLogs: [],
  currentLog: null,
  loading: false,
  error: null,
};

export const workLogsReducer = createReducer(
  initialWorkLogsState,

  on(WorkLogsActions.loadCurrentWeekLogs, (state) => ({ ...state, loading: true, error: null })),
  on(WorkLogsActions.loadCurrentWeekLogsSuccess, (state, { logs }) => ({
    ...state,
    allLogs: logs,
    loading: false,
    error: null
  })),
  on(WorkLogsActions.loadCurrentWeekLogsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(WorkLogsActions.loadWorkLogForDate, (state) => ({
      ...state,
      loading: true,
      error: null
  })),
  on(WorkLogsActions.loadWorkLogForDateSuccess, (state, { log }) => ({
      ...state,
      currentLog: log,
      loading: false
  })),
  on(WorkLogsActions.loadWorkLogForDateFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
  })),

  on(WorkLogsActions.clockInSuccess, (state, { log }) => ({
    ...state,
    currentLog: log,
    allLogs: state.allLogs.some(l => l.worklogId === log.worklogId)
      ? state.allLogs.map(l => l.worklogId === log.worklogId ? log : l)
      : [...state.allLogs, log]
  })),

  on(WorkLogsActions.clockOutSuccess, (state, { log }) => ({
    ...state,
    currentLog: log,
    allLogs: state.allLogs.map(l => l.worklogId === log.worklogId ? log : l)
  })),

  on(WorkLogsActions.takeBreakSuccess, (state, { log }) => ({
    ...state,
    currentLog: log,
    allLogs: state.allLogs.map(l => l.worklogId === log.worklogId ? log : l)
    })),

  on(WorkLogsActions.resumeWorkSuccess, (state, { log }) => ({
    ...state,
    currentLog: log,
    allLogs: state.allLogs.map(l => l.worklogId === log.worklogId ? log : l)
    })),
  on(AuthActions.logout, () => initialWorkLogsState)
);