import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LookupEntities } from '../../models/lookups.model';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LookupsService {
  http: HttpClient = inject(HttpClient);
  private lookups!: LookupEntities;

  getAllLookups(): Observable<LookupEntities> {
    return this.http.get<LookupEntities>(
      `${environment.apiUrl}/lookups/lookups`
    );
  }

  setLookups(lookups: LookupEntities): void {
    this.lookups = lookups;
  }

  getLookups(): LookupEntities {
    if (!this.lookups) {
      throw new Error('Lookups not loaded yet!');
    }
    return this.lookups;
  }
}
