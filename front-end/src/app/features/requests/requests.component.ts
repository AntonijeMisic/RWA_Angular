import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable } from 'rxjs';

import {
  LeaveRequest,
  UpdateStatusDto,
} from '../../core/models/leaveRequest.model';
import { RequestStatus } from '../../core/models/lookups.model';
import { LookupsService } from '../../core/services/lookups/lookups.service';
import { FilterPipe } from './filter.pipe';
import { StatusFilterPipe } from './status-filter.pipe';
import { selectCurrentUser } from '../../store/users/users.selectors';
import { selectAllLeaveRequests } from '../../store/leave-requests/leave-requests.selectors';
import {
  loadLeaveRequests,
  updateLeaveRequestStatus,
} from '../../store/leave-requests/leave-requests.actions';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipe, StatusFilterPipe],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css',
})
export class RequestsComponent implements OnInit {
  private store = inject(Store);
  private lookupService = inject(LookupsService);

  currentUserId = signal<number | null>(null);

  leaveRequests$: Observable<LeaveRequest[]> = this.store.select(
    selectAllLeaveRequests
  );

  requestStatuses: RequestStatus[] = [];
  searchText = '';
  filterStatus: number | null = null;

  ngOnInit(): void {
    this.requestStatuses = this.lookupService.getLookups().requestStatuses;
    combineLatest([this.store.select(selectCurrentUser)])
      .pipe(map(([user]) => user))
      .subscribe((user) => {
        if (user) {
          this.currentUserId.set(user.userId);
          this.store.dispatch(loadLeaveRequests());
        }
      });
  }

  private getUserId(): number | null {
    return this.currentUserId();
  }

  approveRequest(req: LeaveRequest) {
    const dto: UpdateStatusDto = {
      requestId: req.requestId,
      approverId: this.getUserId()!,
      statusId: 2, // Approved
    };
    this.store.dispatch(updateLeaveRequestStatus({ dto }));
  }

  rejectRequest(req: LeaveRequest) {
    const dto: UpdateStatusDto = {
      requestId: req.requestId,
      approverId: this.getUserId()!,
      statusId: 3, // Rejected
    };
    this.store.dispatch(updateLeaveRequestStatus({ dto }));
  }
}