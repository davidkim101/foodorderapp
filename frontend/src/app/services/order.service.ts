import { Injectable } from '@angular/core';
import { Order } from '../shared/models/Order';
import { HttpClient } from '@angular/common/http';
import {
  ORDERS_CREATE_URL,
  ORDERS_NEW_FOR_CURRENT_USER_URL,
  ORDERS_PAY_URL,
  ORDERS_TRACK_URL,
} from '../shared/constants/urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  create(order: Order) {
    return this.http.post<Order>(ORDERS_CREATE_URL, order);
  }

  getNewOrderForCurrentUser() {
    return this.http.get<Order>(ORDERS_NEW_FOR_CURRENT_USER_URL);
  }

  pay(order: Order): Observable<string> {
    return this.http.post<string>(ORDERS_PAY_URL, order);
  }

  trackOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(ORDERS_TRACK_URL + id);
  }
}
