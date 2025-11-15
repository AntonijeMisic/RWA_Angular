import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkLog } from '../../models/workLog.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WorkLogService {
  private http = inject(HttpClient);

  clockIn(userId: number, workTypeId?: number): Observable<WorkLog> {
    return this.http.post<WorkLog>(`${environment.apiUrl}/worklog/clock-in`, {
      userId,
      workTypeId,
    });
  }

  takeBreak(userId: number): Observable<WorkLog> {
    return this.http.post<WorkLog>(
      `${environment.apiUrl}/worklog/start-break`,
      { userId }
    );
  }

  resumeWork(userId: number): Observable<WorkLog> {
    return this.http.post<WorkLog>(
      `${environment.apiUrl}/worklog/resume-work`,
      { userId }
    );
  }

  clockOut(userId: number): Observable<WorkLog> {
    return this.http.post<WorkLog>(`${environment.apiUrl}/worklog/clock-out`, {
      userId,
    });
  }

  getWorkLogsForUser(userId: number): Observable<WorkLog[]> {
    return this.http.get<WorkLog[]>(
      `${environment.apiUrl}/worklog/my-logs?userId=${userId}`
    );
  }

  getCurrentWeekLogs(userId: number): Observable<WorkLog[]> {
    return this.http.get<WorkLog[]>(
      `${environment.apiUrl}/workLog/current-week?userId=${userId}`
    );
  }

  getCurrentLog(userId: number, date: string): Observable<WorkLog> {
    return this.http.get<WorkLog>(
      `${environment.apiUrl}/workLog/user/${userId}/date/${date}`
    );
  }
}
