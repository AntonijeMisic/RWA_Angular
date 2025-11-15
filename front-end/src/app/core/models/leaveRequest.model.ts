import { LeaveType, RequestStatus } from './lookups.model';
import { User } from './user.model';

export interface LeaveRequest {
  requestId: number;
  user: User;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  requestStatus: RequestStatus;
  approver?: User | null;
  requestDate: Date;
  note?: string | null;
}

export interface CreateLeaveRequest {
  userId: number;
  leaveTypeId: number;
  startDate: Date;
  endDate: Date;
  note?: string | null;
}

export interface UpdateStatusDto {
  requestId: number;
  approverId: number;
  statusId: number;
}