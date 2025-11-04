import { User } from './user.model';

export interface LeaveType {
  leaveTypeId: number;
  leaveTypeName: string;
}
export interface RequestStatus {
  statusId: number;
  requestStatusName: string;
}

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