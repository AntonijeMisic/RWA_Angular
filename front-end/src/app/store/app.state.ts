import { AnnouncementsState } from './announcements/announcements.reducer';
import { LeaveRequestState } from './leave-requests/leave-requests.reducer';
import { UsersState } from './users/users.reducer';
import { WorkLogsState } from './workLogs/workLogs.reducer';

export interface AppState {
  users: UsersState;
  announcements: AnnouncementsState;
  workLogs: WorkLogsState;
  leaveRequests: LeaveRequestState;
}