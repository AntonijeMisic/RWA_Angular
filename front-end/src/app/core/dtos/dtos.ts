export interface UserFilterDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  userRoleId?: number;
  userPositionId?: number;
}

export interface CreateLeaveRequestDto {
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