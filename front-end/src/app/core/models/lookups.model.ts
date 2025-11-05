export interface UserRole {
  userRoleId: number;
  roleName: string;
}

export interface UserPosition {
  userPositionId: number;
  userPositionName: string;
}

export interface LeaveType {
  leaveTypeId: number;
  leaveTypeName: string;
}

export interface RequestStatus {
  requestStatusId: number;
  requestStatusName: string;
}

export interface LookupEntities {
  userRoles: UserRole[];
  userPositions: UserPosition[];
  leaveTypes: LeaveType[];
  requestStatuses: RequestStatus[];
}