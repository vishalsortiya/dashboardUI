// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'assets/users.json';

  constructor(private http: HttpClient) { }

  authenticate(username?: string, password?: string): Observable<boolean> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(users => {
        if (username && password) {
          // Check credentials only if username and password are provided
          const validUser = users.users.find(
            (user: { username: string; password: string; }) => user.username === username && user.password === password
          );
          return !!validUser;
        } else {
          // Check authentication status without specific credentials
          // You might implement a different logic here based on your requirements
          return true; // Placeholder for authentication status check
        }
      })
    );
  }
}
