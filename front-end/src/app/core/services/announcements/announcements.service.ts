import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Announcement } from '../../models/announcement.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnnouncementService {
  constructor(private http: HttpClient) {}

  getAllAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${environment.apiUrl}/announcements`);
  }

  getAnnouncementById(id: number): Observable<Announcement> {
    return this.http.get<Announcement>(
      `${environment.apiUrl}/announcements/${id}`
    );
  }

  create(announcement: Partial<Announcement>): Observable<Announcement> {
    return this.http.post<Announcement>(
      `${environment.apiUrl}/announcements`,
      announcement
    );
  }

  update(announcement: Partial<Announcement>): Observable<Announcement> {
    return this.http.put<Announcement>(
      `${environment.apiUrl}/announcements/${announcement.announcementId}`,
      announcement
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/announcements/${id}`);
  }
}