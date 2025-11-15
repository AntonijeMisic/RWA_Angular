import { createSelector, createFeatureSelector } from '@ngrx/store';
import { WorkLogsState } from './workLogs.reducer';

export const selectWorkLogsState = createFeatureSelector<WorkLogsState>('workLogs');

export const selectAllWorkLogs = createSelector(
  selectWorkLogsState,
  state => state.allLogs
);

export const selectCurrentWorkLog = createSelector(
  selectWorkLogsState,
  state => state.currentLog
);

export const selectWorkLogsLoading = createSelector(
  selectWorkLogsState,
  state => state.loading
);
