import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../app-interfaces';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  constructor(private http: HttpClient) {}

  baserUrl = 'http://localhost:3000/items/';

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.baserUrl);
  }
}
