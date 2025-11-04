import { Component, OnInit } from '@angular/core';
import { LeaveRequest, LeaveType, RequestStatus } from '../../core/models/leaveRequest.model';
import { User } from '../../core/models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from './filter.pipe';
import { StatusFilterPipe } from './status-filter.pipe';

@Component({
  selector: 'app-requests.component',
  imports: [CommonModule, FormsModule, FilterPipe, StatusFilterPipe],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css'
})
export class RequestsComponent implements OnInit {
  leaveRequests: LeaveRequest[] = [];
  isAdmin = true; // samo za test
  searchText: string = '';
  filterStatus: string = ''; // <-- dodaj ovo

  ngOnInit(): void {
    const admin: User = {
      userId: 1,
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      userRoleId: 1,
      userRole: { roleName: 'Admin' } as any,
      userPositionId: 1,
      userPosition: { userPositionName: 'Manager' } as any,
      startDate: new Date('2020-01-01')
    };

    const employee1: User = {
      userId: 2,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      userRoleId: 2,
      userRole: { roleName: 'Employee' } as any,
      userPositionId: 2,
      userPosition: { userPositionName: 'Developer' } as any,
      startDate: new Date('2021-05-10')
    };

    const leaveAnnual: LeaveType = { leaveTypeId: 1, leaveTypeName: 'Annual Leave' };
    const leaveSick: LeaveType = { leaveTypeId: 2, leaveTypeName: 'Sick Leave' };

    const statusPending: RequestStatus = { statusId: 1, requestStatusName: 'Pending' };
    const statusApproved: RequestStatus = { statusId: 2, requestStatusName: 'Approved' };

    this.leaveRequests = [
      {
        requestId: 1,
        user: employee1,
        leaveType: leaveAnnual,
        startDate: new Date('2025-11-10'),
        endDate: new Date('2025-11-14'),
        requestStatus: statusPending,
        approver: null,
        requestDate: new Date('2025-11-01'),
        note: 'Family trip'
      },
      {
        requestId: 2,
        user: employee1,
        leaveType: leaveSick,
        startDate: new Date('2025-11-03'),
        endDate: new Date('2025-11-05'),
        requestStatus: statusApproved,
        approver: admin,
        requestDate: new Date('2025-10-30'),
        note: 'Flu'
      }
    ];
  }

  approveRequest(req: LeaveRequest) {
    req.requestStatus.requestStatusName = 'Approved';
    req.approver = {
      userId: 1,
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      userRoleId: 1,
      userRole: { roleName: 'Admin' } as any,
      userPositionId: 1,
      userPosition: { userPositionName: 'Manager' } as any,
      startDate: new Date('2020-01-01')
    };
  }

  rejectRequest(req: LeaveRequest) {
    req.requestStatus.requestStatusName = 'Rejected';
    req.approver = {
      userId: 1,
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      userRoleId: 1,
      userRole: { roleName: 'Admin' } as any,
      userPositionId: 1,
      userPosition: { userPositionName: 'Manager' } as any,
      startDate: new Date('2020-01-01')
    };
  }
}
