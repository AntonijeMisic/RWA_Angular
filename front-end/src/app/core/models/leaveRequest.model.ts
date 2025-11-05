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