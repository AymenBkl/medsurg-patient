import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router,
              private authService: AuthService) { }

  canActivate(): boolean {
    if (this.authService.authenticated)
    {
      this.authService.authenticated
      .subscribe(authenticated => {
        console.log(authenticated);
        if (authenticated){
          return true;
        }
        else {
          this.router.navigate(['/login']);
          return false;
        }
      }); }
       else {
        this.router.navigate(['/login']);
        return false;
      }
  }
}
