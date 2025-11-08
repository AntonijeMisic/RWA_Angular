import { User } from "./user.model";

export interface Announcement {
  announcementId: number;
  title: string;
  message: string;
  createdBy?: User | null;
  visible_until?: Date | null;
}
