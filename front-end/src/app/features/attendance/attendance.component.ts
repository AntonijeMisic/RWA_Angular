import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { startOfWeek, addDays, format } from 'date-fns';
import * as WorkLogsActions from '../../store/workLogs/workLogs.actions';
import * as LeaveRequestActions from '../../store/leave-requests/leave-requests.actions';
import { WorkLog } from '../../core/models/workLog.model';
import {
  selectAllWorkLogs,
  selectCurrentWorkLog,
} from '../../store/workLogs/workLogs.selectors';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { selectCurrentUser } from '../../store/users/users.selectors';
import { WorkLogDialogComponent } from './workLog-dialog/workLog-dialog.component';
import { LeaveRequest } from '../../core/models/leaveRequest.model';
import { selectWeeklyApprovedLeavesForUser } from '../../store/leave-requests/leave-requests.selectors';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
  imports: [FormsModule, CommonModule, WorkLogDialogComponent],
  standalone: true,
})
export class AttendanceComponent implements OnInit {
  private store = inject(Store<AppState>);
  allLogs = signal<WorkLog[]>([]);
  currentUserId = signal<number | null>(null);

  showWorkTypeDialog = false;
  selectedDay: Date | null = null;

  isOnBreak = signal(false);
  breakMinutes = signal(0);
  approvedLeaves = signal<LeaveRequest[]>([]);
  breakInterval: any = null;

  weeklyLogs = computed(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const leaves = this.approvedLeaves();

    const logs: Array<{
      log: WorkLog | null;
      day: Date;
      isWeekend: boolean;
      isToday: boolean;
      isLeave: boolean;
      leaveType: string | null;
    }> = [];

    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      day.setHours(0, 0, 0, 0);

      const existingLog = this.allLogs().find((log) => {
        const logDate = new Date(log.workDate);
        logDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === day.getTime();
      });

      const leave = leaves.find((l) => {
        const start = new Date(l.startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(l.endDate);
        end.setHours(0, 0, 0, 0);
        return (
          day.getTime() >= start.getTime() && day.getTime() <= end.getTime()
        );
      });

      logs.push({
        log: existingLog || null,
        day,
        isWeekend: day.getDay() === 0 || day.getDay() === 6,
        isToday: format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd'),
        isLeave: !!leave,
        leaveType: leave ? leave.leaveType.leaveTypeName : null,
      });
    }

    return logs;
  });

  ngOnInit() {
    this.store.select(selectCurrentUser).subscribe((user) => {
      if (user) {
        this.currentUserId.set(user.userId);
        this.store.dispatch(
          WorkLogsActions.loadCurrentWeekLogs({ userId: user.userId! })
        );
        this.store.dispatch(
          WorkLogsActions.loadWorkLogForDate({
            userId: user.userId!,
            date: format(new Date(), 'yyyy-MM-dd'),
          })
        );
        const weekStart = format(
          startOfWeek(new Date(), { weekStartsOn: 1 }),
          'yyyy-MM-dd'
        );
        const weekEnd = format(
          addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 6),
          'yyyy-MM-dd'
        );

        this.store.dispatch(
          LeaveRequestActions.loadApprovedLeavesForWeek({
            userId: user.userId!,
            start: weekStart,
            end: weekEnd,
          })
        );
      }
    });

    this.store.select(selectAllWorkLogs).subscribe((logs) => {
      this.allLogs.set(logs);
    });
    this.store.select(selectCurrentWorkLog).subscribe((log) => {
      if (log) {
        this.isOnBreak.set(!!log.startBreakTime && !log.breakMinutes);
      } else {
        this.isOnBreak.set(false);
      }
    });
    this.store.select(selectWeeklyApprovedLeavesForUser).subscribe((leaves) => {
      this.approvedLeaves.set(leaves || []);
    });
  }

  private getUserId(): number | null {
    return this.currentUserId();
  }

  clockIn(day: Date) {
    if (this.isWeekend(day)) return;
    const userId = this.getUserId();
    if (!userId) return;
    this.store.dispatch(WorkLogsActions.clockIn({ userId }));
  }

  clockOut(day: Date) {
    if (this.isWeekend(day)) return;
    const userId = this.getUserId();
    if (!userId) return;
    this.store.dispatch(WorkLogsActions.clockOut({ userId }));
  }

  takeBreak(day: Date) {
    if (this.isWeekend(day)) return;

    const userId = this.getUserId();
    if (!userId) return;

    if (!this.isOnBreak()) {
      this.isOnBreak.set(true);

      this.store.dispatch(WorkLogsActions.takeBreak({ userId }));
    } else {
      this.isOnBreak.set(false);
      this.store.dispatch(WorkLogsActions.resumeWork({ userId }));
    }
  }

  isWeekend(day: Date) {
    const dayOfWeek = day.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  }

  isToday(day: Date) {
    const today = new Date();
    return (
      day.getFullYear() === today.getFullYear() &&
      day.getMonth() === today.getMonth() &&
      day.getDate() === today.getDate()
    );
  }

  convertTotalHoursToHHMMSS(totalHours: number | null | undefined): string {
    if (totalHours === null || totalHours === undefined) {
      return '00:00:00';
    }

    const hoursFloat = Number(totalHours); // ako dođe kao string
    const totalSeconds = Math.round(hoursFloat * 3600);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  openWorkTypeDialog(day: Date) {
    this.selectedDay = day;
    this.showWorkTypeDialog = true;
  }

  onWorkTypeSelected(workTypeId: number) {
    this.showWorkTypeDialog = false;

    const userId = this.getUserId();
    if (!userId || !this.selectedDay) return;

    this.store.dispatch(
      WorkLogsActions.clockIn({ userId, workTypeId: workTypeId })
    );
    this.selectedDay = null;
  }

  onWorkTypeDialogCancel() {
    this.showWorkTypeDialog = false;
    this.selectedDay = null;
  }
}