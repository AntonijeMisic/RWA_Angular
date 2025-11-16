import { createSelector, createFeatureSelector } from '@ngrx/store';
import { WorkLogsState } from './workLogs.reducer';
import { WorkLog } from '../../core/models/workLog.model';

export const selectWorkLogsState =
  createFeatureSelector<WorkLogsState>('workLogs');

export const selectAllWorkLogs = createSelector(
  selectWorkLogsState,
  (state: WorkLogsState) =>
    Object.values(state.entities)
      .filter((log) => !!log)
      .map((log) => <WorkLog>log)
);

export const selectCurrentWorkLog = createSelector(
  selectWorkLogsState,
  (state) => state.currentLog
);

export const selectWorkLogsLoading = createSelector(
  selectWorkLogsState,
  (state) => state.loading
);