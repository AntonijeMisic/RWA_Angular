import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Announcement } from '../../models/announcement.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnnouncementService {

  constructor(private http: HttpClient) {}

  getAllAnnouncements(): Observable<Announcement[]> {
    const token = localStorage.getItem(environment.accessTokenKey);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Announcement[]>(`${environment.apiUrl}/announcements`, {headers});
  }

  create(announcement: Partial<Announcement>): Observable<Announcement> {
    const token = localStorage.getItem(environment.accessTokenKey);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<Announcement>(`${environment.apiUrl}/announcements`, announcement, {headers});
  }

  update(announcement: Announcement): Observable<Announcement> {
    const token = localStorage.getItem(environment.accessTokenKey);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<Announcement>(
      `${environment.apiUrl}/announcements/${announcement.announcementId}`,
      announcement, { headers }
    );
  }

  delete(id: number): Observable<void> {
    const token = localStorage.getItem(environment.accessTokenKey);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<void>(`${environment.apiUrl}/announcements/${id}`, { headers });
  }
}