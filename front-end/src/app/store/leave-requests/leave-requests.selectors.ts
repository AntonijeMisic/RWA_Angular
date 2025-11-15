import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LeaveRequestState } from './leave-requests.reducer';

export const selectLeaveRequestState =
  createFeatureSelector<LeaveRequestState>('leaveRequests');

export const selectAllLeaveRequests = createSelector(
  selectLeaveRequestState,
  (state) => state.leaveRequests
);

export const selectAllLeaveRequestsByUser = createSelector(
  selectLeaveRequestState,
  (state) => state.leaveRequestsByUser
);

export const selectWeeklyApprovedLeavesForUser = createSelector(
  selectLeaveRequestState,
  (state) => state.weeklyApprovedLeavesForUser
);

export const selectLeaveTypes = createSelector(
  selectLeaveRequestState,
  (state) => state.leaveTypes
);

export const selectLeaveRequestsByStatus = (status: string) =>
  createSelector(selectAllLeaveRequests, (leaveRequests) =>
    leaveRequests.filter((r) => r.requestStatus.requestStatusName === status)
  );

export const selectLoading = createSelector(
  selectLeaveRequestState,
  (state) => state.loading
);
