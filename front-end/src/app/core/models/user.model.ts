import { UserPosition, UserRole } from "./lookups.model";

export interface User {
  userId: number | null;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  userRoleId: number;
  userRole: UserRole;
  userPositionId: number;
  userPosition: UserPosition;
  startDate: Date;
  endDate?: Date | null;
}