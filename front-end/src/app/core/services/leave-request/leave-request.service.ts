import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LeaveRequest,
  CreateLeaveRequest,
  UpdateStatusDto,
} from '../../models/leaveRequest.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LeaveRequestService {
  private http = inject(HttpClient);

  getRequestsByUser(userId: number): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(
      `${environment.apiUrl}/leave-requests/user/${userId}`
    );
  }

  getRequests(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(
      `${environment.apiUrl}/leave-requests`
    );
  }

  getApprovedLeavesForWeek(
    userId: number,
    start: string,
    end: string
  ): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(
      `${environment.apiUrl}/leave-requests/user/${userId}/week?start=${start}&end=${end}`
    );
  }

  createLeaveRequest(dto: CreateLeaveRequest): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(
      `${environment.apiUrl}/leave-requests`,
      dto
    );
  }

  updateStatus(dto: UpdateStatusDto) {
    return this.http.patch<LeaveRequest>(
      `${environment.apiUrl}/leave-requests/status`,
      dto
    );
  }
}
