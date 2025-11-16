import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppState } from '../../store/app.state';
import { LeaveRequest } from '../../core/models/leaveRequest.model';
import { LeaveType, RequestStatus } from '../../core/models/lookups.model';
import {
  loadUserLeaveRequests,
  loadLeaveTypes,
  createLeaveRequest,
} from '../../store/leave-requests/leave-requests.actions';
import { selectAllLeaveRequestsByUser } from '../../store/leave-requests/leave-requests.selectors';
import { selectCurrentUser } from '../../store/users/users.selectors';
import { LeaveRequestDialogComponent } from './leave-request-dialog/leave-request-dialog.component';
import { RequestStatus as LeaveRequestStatus } from '../../core/enums/enums';
import { LookupsService } from '../../core/services/lookups/lookups.service';

interface Day {
  date: number;
  isPast: boolean;
  selected: boolean;
  monthIndex: number;
  absenceType?: LeaveType;
  requestStatus?: RequestStatus;
  requestId?: number;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
  isRangeMiddle?: boolean;
}

interface Month {
  name: string;
  days: Day[];
}

@Component({
  selector: 'app-vacation-schedule',
  standalone: true,
  imports: [CommonModule, LeaveRequestDialogComponent],
  templateUrl: './vacation-schedule.component.html',
  styleUrls: ['./vacation-schedule.component.css'],
})
export class VacationScheduleComponent implements OnInit {
  store = inject(Store<AppState>);

  currentYear = new Date().getFullYear();
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  months: Month[] = [];

  currentUserId = signal<number | null>(null);
  showLeaveDialog = signal(false);

  leaveRequests$: Observable<LeaveRequest[]> = this.store.select(
    selectAllLeaveRequestsByUser
  );

  private firstSelectedDay: Day | null = null;

  ngOnInit() {
    this.generateMonths();

    combineLatest([this.store.select(selectCurrentUser)])
      .pipe(map(([user]) => user))
      .subscribe((user) => {
        if (user) {
          this.currentUserId.set(user.userId);
          this.store.dispatch(loadUserLeaveRequests({ userId: user.userId! }));
          this.store.dispatch(loadLeaveTypes());
        }
      });

    this.leaveRequests$.subscribe((requests) => {
      this.clearAllSelections(false);
      this.applyRequestsToCalendar(requests);
    });
  }

  private generateMonths() {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const today = new Date();

    for (let i = 0; i < 12; i++) {
      const daysInMonth = new Date(this.currentYear, i + 1, 0).getDate();
      const month: Month = { name: monthNames[i], days: [] };

      const firstDayOfMonth = new Date(this.currentYear, i, 1);
      const startWeekDay = firstDayOfMonth.getDay();

      for (let j = 0; j < startWeekDay; j++) {
        month.days.push({
          date: 0,
          isPast: false,
          selected: false,
          monthIndex: i,
        });
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(this.currentYear, i, d);
        month.days.push({
          date: d,
          isPast: dateObj < today,
          selected: false,
          monthIndex: i,
        });
      }

      this.months.push(month);
    }
  }

  selectDay(day: Day) {
    if (day.isPast || day.requestStatus) return;

    if (!this.firstSelectedDay) {
      this.firstSelectedDay = day;
      day.selected = true;
      day.isRangeStart = true;
    } else {
      const startMonth = this.firstSelectedDay.monthIndex;
      const endMonth = day.monthIndex;
      const startDate = this.firstSelectedDay.date;
      const endDate = day.date;

      this.clearAllSelections(true);

      for (let m = startMonth; m <= endMonth; m++) {
        this.months[m].days.forEach((d) => {
          if (startMonth === endMonth) {
            if (d.date >= startDate && d.date <= endDate) d.selected = true;
          } else {
            if (m === startMonth && d.date >= startDate) d.selected = true;
            else if (m === endMonth && d.date <= endDate) d.selected = true;
            else if (m > startMonth && m < endMonth) d.selected = true;
          }

          if (d.selected) {
            d.isRangeStart = m === startMonth && d.date === startDate;
            d.isRangeEnd = m === endMonth && d.date === endDate;
            d.isRangeMiddle = !d.isRangeStart && !d.isRangeEnd;
          }
        });
      }

      this.showLeaveDialog.set(true);
      this.firstSelectedDay = null;
    }
  }

  onLeaveDialogConfirm(data: { leaveTypeId: number; note?: string }) {
    const startDay = this.getFirstSelectedDay();
    const endDay = this.getLastSelectedDay();

    if (!startDay || !endDay) return;

    const overlap = this.hasOverlapWithExistingRequests(startDay, endDay);
    if (overlap) {
      alert('Selected range overlaps with existing leave requests.');
      this.clearAllSelections(true);
      this.firstSelectedDay = null;
      return;
    }

    this.store.dispatch(
      createLeaveRequest({
        dto: {
          userId: this.currentUserId()!,
          leaveTypeId: data.leaveTypeId,
          startDate: new Date(
            this.currentYear,
            startDay.monthIndex,
            startDay.date
          ),
          endDate: new Date(this.currentYear, endDay.monthIndex, endDay.date),
          note: data.note,
        },
      })
    );

    this.showLeaveDialog.set(false);
  }

  onLeaveDialogCancel() {
    this.showLeaveDialog.set(false);
    this.cancelSelection();
  }

  private getFirstSelectedDay(): Day | null {
    for (const m of this.months) {
      for (const d of m.days) if (d.selected) return d;
    }
    return null;
  }

  private getLastSelectedDay(): Day | null {
    for (let i = this.months.length - 1; i >= 0; i--) {
      for (let j = this.months[i].days.length - 1; j >= 0; j--) {
        if (this.months[i].days[j].selected) return this.months[i].days[j];
      }
    }
    return null;
  }

  private clearAllSelections(clearVisual: boolean = true) {
    this.months.forEach((m) =>
      m.days.forEach((d) => {
        if (clearVisual) {
          d.selected = false;
          d.isRangeStart = false;
          d.isRangeEnd = false;
          d.isRangeMiddle = false;
        }
      })
    );
  }

  private cancelSelection() {
    this.months.forEach((m) =>
      m.days.forEach((d) => {
        if (d.selected && !d.requestStatus) {
          d.selected = false;
          d.isRangeStart = false;
          d.isRangeEnd = false;
          d.isRangeMiddle = false;
          d.absenceType = undefined;
        }
      })
    );
    this.firstSelectedDay = null;
  }

  private applyRequestsToCalendar(requests: LeaveRequest[]) {
    requests.forEach((req) => {
      const start = new Date(req.startDate);
      const end = new Date(req.endDate);

      for (let m = start.getMonth(); m <= end.getMonth(); m++) {
        const startDateOnly = new Date(
          start.getFullYear(),
          start.getMonth(),
          start.getDate()
        );
        const endDateOnly = new Date(
          end.getFullYear(),
          end.getMonth(),
          end.getDate()
        );

        this.months[m].days.forEach((d) => {
          if (d.date === 0) return;

          const dayDate = new Date(this.currentYear, m, d.date);

          if (dayDate >= startDateOnly && dayDate <= endDateOnly) {
            d.absenceType = req.leaveType;
            d.requestStatus = req.requestStatus;
            d.requestId = req.requestId;
          }
        });
      }
    });
  }

  private hasOverlapWithExistingRequests(startDay: Day, endDay: Day): boolean {
    const startDate = new Date(
      this.currentYear,
      startDay.monthIndex,
      startDay.date
    );
    const endDate = new Date(this.currentYear, endDay.monthIndex, endDay.date);

    for (const month of this.months) {
      for (const d of month.days) {
        if (d.date === 0) continue;
        const current = new Date(this.currentYear, d.monthIndex, d.date);
        if (current >= startDate && current <= endDate && d.requestStatus) {
          return true;
        }
      }
    }

    return false;
  }

  getDayColor(day: Day) {
    if (!day.requestStatus) return '';
    switch (day.requestStatus.requestStatusId) {
      case LeaveRequestStatus.Pending:
        return 'orange';
      case LeaveRequestStatus.Approved:
        return 'green';
      case LeaveRequestStatus.Rejected:
        return 'red';
      default:
        return '';
    }
  }
}
