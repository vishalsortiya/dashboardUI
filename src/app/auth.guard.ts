// auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.authenticate().toPromise().then((authenticated: boolean | undefined) => {
      // Handle potential undefined value
      if (authenticated === undefined) {
        // Handle the case where the observable completed without emitting a value
        // You might want to handle this case based on your application's requirements
        console.error('Authentication observable completed without emitting a value.');
        return false;
      }

      if (authenticated) {
        return true;
      } else {
        // Redirect to the login page if not authenticated
        this.router.navigate(['/login']);
        return false;
      }
    });
  }
}
