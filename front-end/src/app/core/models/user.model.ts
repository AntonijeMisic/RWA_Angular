import { UserPosition, UserRole } from "./lookups.model";

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