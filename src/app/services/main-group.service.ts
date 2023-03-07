import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MainGroup } from '../app-interfaces';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MainGroupService {
  constructor(private http: HttpClient) {}

  baserUrl = 'http://localhost:3000/main-groups/';

  getMainGroups(): Observable<MainGroup[]> {
    return this.http.get<MainGroup[]>(this.baserUrl);
  }
}
