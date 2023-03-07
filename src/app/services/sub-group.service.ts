import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubGroup } from '../app-interfaces';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SubGroupService {
  constructor(private http: HttpClient) {}

  baserUrl = 'http://localhost:3000/sub-groups/';

  getSubGroups(): Observable<SubGroup[]> {
    return this.http.get<SubGroup[]>(this.baserUrl);
  }
}
