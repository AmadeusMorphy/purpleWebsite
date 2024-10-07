import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = 'https://66fbddf48583ac93b40d8ce0.mockapi.io/users/login';

  constructor(private http: HttpClient) { }


  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // Get a specific user by their ID
  getUserById(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  // Update the user's messages within the user data
  updateUserMessages(userId: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}`, userData);
  }
}
