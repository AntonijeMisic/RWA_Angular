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
import { RequestStatus as LeaveRequestStatus } from '../../core/enums/enums';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipe, StatusFilterPipe],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css',
})
export class RequestsComponent implements OnInit {
  store = inject(Store);
  lookupService = inject(LookupsService);

  leaveRequests$: Observable<LeaveRequest[]> = this.store.select(
    selectAllLeaveRequests
  );

  requestStatuses: RequestStatus[] = [];
  searchText = '';
  filterStatus: number | null = null;

  currentUserId = signal<number | null>(null);

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

  approveRequest(req: LeaveRequest) {
    const dto: UpdateStatusDto = {
      requestId: req.requestId,
      approverId: this.currentUserId()!,
      statusId: LeaveRequestStatus.Approved,
    };
    this.store.dispatch(updateLeaveRequestStatus({ dto }));
  }

  rejectRequest(req: LeaveRequest) {
    const dto: UpdateStatusDto = {
      requestId: req.requestId,
      approverId: this.currentUserId()!,
      statusId: LeaveRequestStatus.Rejected,
    };
    this.store.dispatch(updateLeaveRequestStatus({ dto }));
  }
}
