import * as LeaveRequestActions from './leave-requests.actions';
import * as AuthActions from '../auth/auth.actions';
import { LeaveRequest } from '../../core/models/leaveRequest.model';
import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

export interface LeaveRequestState extends EntityState<LeaveRequest> {
  leaveRequestsByUser: LeaveRequest[];
  weeklyApprovedLeavesForUser: LeaveRequest[];
  loading: boolean;
  error?: any;
}

export const leaveRequestsAdapter: EntityAdapter<LeaveRequest> =
  createEntityAdapter<LeaveRequest>({
    selectId: (leave) => leave.requestId
  });

export const initialLeaveRequestState: LeaveRequestState =
  leaveRequestsAdapter.getInitialState({
    leaveRequestsByUser: [],
    weeklyApprovedLeavesForUser: [],
    loading: false,
    error: null,
  });

export const leaveRequestReducer = createReducer(
  initialLeaveRequestState,

  on(LeaveRequestActions.loadLeaveRequests, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(LeaveRequestActions.loadLeaveRequestsSuccess, (state, { leaveRequests }) =>
    leaveRequestsAdapter.setAll(leaveRequests, { ...state, loading: false })
  ),
  on(LeaveRequestActions.loadLeaveRequestsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(LeaveRequestActions.loadUserLeaveRequests, (state) => ({
    ...state,
    loading: true,
    error: null,
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
    loading: false,
    error,
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
      weeklyApprovedLeavesForUser: leaves,
      loading: false,
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

  on(LeaveRequestActions.createLeaveRequest, (state) => ({
    ...state,
    loading: true,
  })),
  on(
    LeaveRequestActions.createLeaveRequestSuccess,
    (state, { leaveRequest }) => ({
      ...leaveRequestsAdapter.addOne(leaveRequest, state),
      leaveRequestsByUser: [...state.leaveRequestsByUser, leaveRequest],
      loading: false,
    })
  ),
  on(LeaveRequestActions.createLeaveRequestFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(LeaveRequestActions.deleteLeaveRequest, (state) => ({
    ...state,
    loading: true,
  })),
  on(LeaveRequestActions.deleteLeaveRequestSuccess, (state, { requestId }) => ({
    ...leaveRequestsAdapter.removeOne(requestId, state),
    leaveRequestsByUser: state.leaveRequestsByUser.filter(
      (r) => r.requestId !== requestId
    ),
    loading: false,
  })),
  on(LeaveRequestActions.deleteLeaveRequestFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(
    LeaveRequestActions.updateLeaveRequestStatusSuccess,
    (state, { leaveRequest }) => ({
      ...leaveRequestsAdapter.updateOne(
        { id: leaveRequest.requestId, changes: leaveRequest },
        state
      ),
      leaveRequestsByUser: state.leaveRequestsByUser.map((r) =>
        r.requestId === leaveRequest.requestId ? leaveRequest : r
      ),
    })
  ),

  on(AuthActions.logout, () => initialLeaveRequestState)
);
