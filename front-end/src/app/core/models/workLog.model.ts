import { WorkType } from './lookups.model';

export interface WorkLog {
  worklogId: number;
  userId: number;
  workType?: WorkType | null;
  clockIn: string;
  clockOut?: string | null;
  breakMinutes?: number | null;
  totalHours?: number | null;
  note?: string | null;
  workDate: string;
  startBreakTime?: string | null;
}