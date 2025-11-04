export interface UserRole {
  userRoleId: number;
  roleName: string;
}

export interface UserPosition {
  userPositionId: number;
  userPositionName: string;
}

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  userRoleId: number;
  userRole: UserRole;
  userPositionId: number;
  userPosition: UserPosition;
  startDate: Date;
  endDate?: Date | null;
}