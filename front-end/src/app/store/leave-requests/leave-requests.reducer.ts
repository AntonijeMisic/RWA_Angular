import { createReducer, on } from '@ngrx/store';
import { LeaveRequest } from '../../core/models/leaveRequest.model';
import { LeaveType } from '../../core/models/lookups.model';
import * as LeaveRequestActions from './leave-requests.actions';
import * as AuthActions from '../auth/auth.actions';

export interface LeaveRequestState {
  leaveRequests: LeaveRequest[];
  leaveRequestsByUser: LeaveRequest[];
  weeklyApprovedLeavesForUser: LeaveRequest[];
  leaveTypes: LeaveType[];
  loading: boolean;
  error?: any;
}

export const initialLeaveRequestState: LeaveRequestState = {
  leaveRequests: [],
  leaveRequestsByUser: [],
  weeklyApprovedLeavesForUser: [],
  leaveTypes: [],
  loading: false,
  error: null,
};

export const leaveRequestReducer = createReducer(
  initialLeaveRequestState,

  on(LeaveRequestActions.loadLeaveRequests, (state) => ({
    ...state,
    loading: true,
  })),
  on(
    LeaveRequestActions.loadLeaveRequestsSuccess,
    (state, { leaveRequests }) => ({
      ...state,
      leaveRequests,
      loading: false,
    })
  ),
  on(LeaveRequestActions.loadLeaveRequestsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Load leave requests by user
  on(LeaveRequestActions.loadUserLeaveRequests, (state) => ({
    ...state,
    loading: true,
  })),
  on(
    LeaveRequestActions.loadUserLeaveRequestsSuccess,
    (state, { leaveRequestsByUser }) => ({
      ...state,
      leaveRequestsByUser,
      loading: false,
    })
  ),
  on(LeaveRequestActions.loadUserLeaveRequestsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(LeaveRequestActions.loadApprovedLeavesForWeek, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(
    LeaveRequestActions.loadApprovedLeavesForWeekSuccess,
    (state, { leaves }) => ({
      ...state,
      loading: false,
      weeklyApprovedLeavesForUser: leaves,
      error: null,
    })
  ),

  on(
    LeaveRequestActions.loadApprovedLeavesForWeekFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })
  ),

  // Load leave types
  on(LeaveRequestActions.loadLeaveTypes, (state) => ({
    ...state,
    loading: true,
  })),
  on(LeaveRequestActions.loadLeaveTypesSuccess, (state, { leaveTypes }) => ({
    ...state,
    leaveTypes,
    loading: false,
  })),
  on(LeaveRequestActions.loadLeaveTypesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Create leave request
  on(LeaveRequestActions.createLeaveRequest, (state) => ({
    ...state,
    loading: true,
  })),
  on(
    LeaveRequestActions.createLeaveRequestSuccess,
    (state, { leaveRequest }) => ({
      ...state,
      leaveRequests: [...state.leaveRequests, leaveRequest],
      leaveRequestsByUser: [...state.leaveRequestsByUser, leaveRequest],
      loading: false,
    })
  ),
  on(LeaveRequestActions.createLeaveRequestFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Delete leave request
  on(LeaveRequestActions.deleteLeaveRequest, (state) => ({
    ...state,
    loading: true,
  })),
  on(LeaveRequestActions.deleteLeaveRequestSuccess, (state, { requestId }) => ({
    ...state,
    leaveRequests: state.leaveRequests.filter((r) => r.requestId !== requestId),
    loading: false,
  })),
  on(LeaveRequestActions.deleteLeaveRequestFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Update status
  on(
    LeaveRequestActions.updateLeaveRequestStatusSuccess,
    (state, { leaveRequest }) => ({
      ...state,
      leaveRequests: state.leaveRequests.map((r) =>
        r.requestId === leaveRequest.requestId ? leaveRequest : r
      ),
      leaveRequestsByUser: state.leaveRequestsByUser.map((r) =>
        r.requestId === leaveRequest.requestId ? leaveRequest : r
      ),
    })
  ),
  on(AuthActions.logout, () => initialLeaveRequestState)
);
