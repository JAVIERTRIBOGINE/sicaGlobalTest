import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable()
export class CanActivateLoggedGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    /**
     * evalúa si estás logeado
     **/    
    if (!this.authService.isLogged()) {
      return false;
    }
    return true;
  }
}
