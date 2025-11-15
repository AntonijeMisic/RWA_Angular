import { createAction, props } from '@ngrx/store';
import {
  LeaveRequest,
  CreateLeaveRequest,
  UpdateStatusDto,
} from '../../core/models/leaveRequest.model';
import { LeaveType } from '../../core/models/lookups.model';

export const loadLeaveRequests = createAction(
  '[LeaveRequest] Load Leave Requests'
);

export const loadLeaveRequestsSuccess = createAction(
  '[LeaveRequest] Load Leave Requests Success',
  props<{ leaveRequests: LeaveRequest[] }>()
);

export const loadLeaveRequestsFailure = createAction(
  '[LeaveRequest] Load Leave Requests Failure',
  props<{ error: any }>()
);

// Load Leave Requests (za usera)
export const loadUserLeaveRequests = createAction(
  '[LeaveRequest] Load Leave Requests For User',
  props<{ userId: number }>()
);

export const loadUserLeaveRequestsSuccess = createAction(
  '[LeaveRequest] Load Leave Requests For User Success',
  props<{ leaveRequestsByUser: LeaveRequest[] }>()
);

export const loadUserLeaveRequestsFailure = createAction(
  '[LeaveRequest] Load Leave Requests For User Failure',
  props<{ error: any }>()
);

export const loadApprovedLeavesForWeek = createAction(
  '[Leave Requests] Load Approved Leaves For Week',
  props<{ userId: number; start: string; end: string }>()
);

export const loadApprovedLeavesForWeekSuccess = createAction(
  '[Leave Requests] Load Approved Leaves For Week Success',
  props<{ leaves: LeaveRequest[] }>()
);

export const loadApprovedLeavesForWeekFailure = createAction(
  '[Leave Requests] Load Approved Leaves For Week Failure',
  props<{ error: string }>()
);

// Load Leave Types (lookup)
export const loadLeaveTypes = createAction('[LeaveRequest] Load Leave Types');

export const loadLeaveTypesSuccess = createAction(
  '[LeaveRequest] Load Leave Types Success',
  props<{ leaveTypes: LeaveType[] }>()
);

export const loadLeaveTypesFailure = createAction(
  '[LeaveRequest] Load Leave Types Failure',
  props<{ error: any }>()
);

// Create new leave request
export const createLeaveRequest = createAction(
  '[LeaveRequest] Create Leave Request',
  props<{ dto: CreateLeaveRequest }>()
);

export const createLeaveRequestSuccess = createAction(
  '[LeaveRequest] Create Leave Request Success',
  props<{ leaveRequest: LeaveRequest }>()
);

export const createLeaveRequestFailure = createAction(
  '[LeaveRequest] Create Leave Request Failure',
  props<{ error: any }>()
);

// Delete leave request
export const deleteLeaveRequest = createAction(
  '[LeaveRequest] Delete Leave Request',
  props<{ requestId: number }>()
);

export const deleteLeaveRequestSuccess = createAction(
  '[LeaveRequest] Delete Leave Request Success',
  props<{ requestId: number }>()
);

export const deleteLeaveRequestFailure = createAction(
  '[LeaveRequest] Delete Leave Request Failure',
  props<{ error: any }>()
);

// Update status
export const updateLeaveRequestStatus = createAction(
  '[LeaveRequest] Update Leave Request Status',
  props<{ dto: UpdateStatusDto }>()
);

export const updateLeaveRequestStatusSuccess = createAction(
  '[LeaveRequest] Update Leave Request Status Success',
  props<{ leaveRequest: LeaveRequest }>()
);

export const updateLeaveRequestStatusFailure = createAction(
  '[LeaveRequest] Update Leave Request Status Failure',
  props<{ error: any }>()
);
