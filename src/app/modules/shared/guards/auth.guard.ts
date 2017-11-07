import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from './../services/firebase/authentication.service';
import { fbAuth } from './../../../../environments/firebase-auth-config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authentication: AuthenticationService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    fbAuth.onAuthStateChanged(user => {
      if(!user) {
        this.router.navigate(['/login']);
      }
    })

    return true;
  }
}
