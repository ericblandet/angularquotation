import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item, Quote } from '../app-interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  constructor(private http: HttpClient) {}

  baserUrl = 'http://localhost:3000/';

  getQuote(quoteId: string): Observable<Quote> {
    return this.http.get<Quote>(`${this.baserUrl}quotes/${quoteId}`);
  }

  updateQuote(quoteId: string, items: Item[]): Observable<Quote> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put<Quote>(
      `${this.baserUrl}quotes/${quoteId}`,
      { items },
      { headers: headers }
    );
  }
}
