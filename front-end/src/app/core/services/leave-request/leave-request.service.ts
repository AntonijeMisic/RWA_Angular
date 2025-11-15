import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LeaveRequest,
  CreateLeaveRequest,
  UpdateStatusDto,
} from '../../models/leaveRequest.model';
import { LeaveType } from '../../models/lookups.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LeaveRequestService {
  private http = inject(HttpClient);

  getRequestsByUser(userId: number): Observable<LeaveRequest[]> {
    const token = localStorage.getItem(environment.accessTokenKey);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<LeaveRequest[]>(
      `${environment.apiUrl}/leave-requests/user/${userId}`,
      { headers }
    );
  }

  getRequests(): Observable<LeaveRequest[]> {
    const token = localStorage.getItem(environment.accessTokenKey);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<LeaveRequest[]>(
      `${environment.apiUrl}/leave-requests`,
      { headers }
    );
  }

  getApprovedLeavesForWeek(
    userId: number,
    start: string,
    end: string
  ): Observable<LeaveRequest[]> {
    const token = localStorage.getItem(environment.accessTokenKey);
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.get<LeaveRequest[]>(
      `${environment.apiUrl}/leave-requests/user/${userId}/week?start=${start}&end=${end}`,
      { headers }
    );
  }

  createLeaveRequest(dto: CreateLeaveRequest): Observable<LeaveRequest> {
    const token = localStorage.getItem(environment.accessTokenKey);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<LeaveRequest>(
      `${environment.apiUrl}/leave-requests`,
      dto,
      { headers }
    );
  }

  deleteRequest(requestId: number): Observable<void> {
    //ne znam da li mi treba
    return this.http.delete<void>(
      `${environment.apiUrl}/leave-requests/${requestId}`
    );
  }

  updateStatus(dto: UpdateStatusDto) {
    const token = localStorage.getItem(environment.accessTokenKey);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.patch<LeaveRequest>(
      `${environment.apiUrl}/leave-requests/status`,
      dto,
      { headers }
    );
  }
}
