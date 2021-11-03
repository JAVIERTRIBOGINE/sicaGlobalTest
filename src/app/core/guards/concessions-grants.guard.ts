import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router, RouterStateSnapshot } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { AccountService } from '../services/account.service';
import { RouterService } from '../services/router.servcice';

@Injectable()
export class CanActivateConcessionAuthGuard implements CanActivate {

  concessionSlug;
  staticConcession;
  entityConcessionSlug
  constructor(
    private accountService: AccountService,
    private routerService: RouterService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  /**
   * A partir de los datos de url, los recoge y va a controlar si 
   * están incluídos en el objeto permissions del accountService
   * @param route 
   * @param state 
   * @returns 
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let validUrl = state.url.split('/');
    validUrl.splice(0, 1);
    [this.staticConcession, this.concessionSlug] = validUrl;


    let isThereConcession = this.accountService.getAllowedConcessions().find(allowedConc => allowedConc.value === this.concessionSlug);
    if (isThereConcession ) {
      
      return true;
    } else {
      
      this.accountService.setUnauthorizedConcession(this.concessionSlug, (isThereConcession?true:false));
      this.router.navigate(['/unauthorized'])
      return false;
    }

  }
}
