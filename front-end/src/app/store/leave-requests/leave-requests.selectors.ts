import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LeaveRequestState } from './leave-requests.reducer';
import { LeaveRequest } from '../../core/models/leaveRequest.model';

export const selectLeaveRequestState =
  createFeatureSelector<LeaveRequestState>('leaveRequests');

export const selectAllLeaveRequests = createSelector(
  selectLeaveRequestState,
  (state: LeaveRequestState) =>
    Object.values(state.entities)
      .filter((request) => !!request)
      .map((request) => <LeaveRequest>request)
);

export const selectAllLeaveRequestsByUser = createSelector(
  selectLeaveRequestState,
  (state) => state.leaveRequestsByUser
);

export const selectWeeklyApprovedLeavesForUser = createSelector(
  selectLeaveRequestState,
  (state) => state.weeklyApprovedLeavesForUser
);

export const selectLeaveRequestsByStatus = (status: string) =>
  createSelector(selectAllLeaveRequests, (leaveRequests) =>
    leaveRequests.filter((r) => r.requestStatus.requestStatusName === status)
  );

export const selectLoading = createSelector(
  selectLeaveRequestState,
  (state) => state.loading
);
