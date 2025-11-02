export interface UserRole {
  userRoleId: number;
  name: string;
}

export interface UserPosition {
  userPositionId: number;
  name: string;
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