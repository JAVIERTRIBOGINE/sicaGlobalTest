import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterStateSnapshot } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { AccountService } from '../services/account.service';
import * as constants from 'src/app/core/config/const'


@Injectable()
export class CanActivateEntitiesAuthGuard implements CanActivate {
  concessionSlug;
  staticConcession;
  entityConcessionSlug
  constructor(
    private authService: AuthService, 
    private router: Router,
    private accountService: AccountService
    ) { }

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
     [this.staticConcession, this.concessionSlug, this.entityConcessionSlug] = validUrl;
    let isThereConcession = this.accountService.getAllowedConcessions().find(allowedConc => allowedConc.value === this.concessionSlug);
    let allowedEntities = this.accountService.getAllowedEntitesByConcession(this.concessionSlug);
    let isThereEntityInConcession = !!allowedEntities && !!constants.ENTITY_REFERENCES[this.entityConcessionSlug.toUpperCase()] ? allowedEntities.includes(constants.ENTITY_REFERENCES[this.entityConcessionSlug.toUpperCase()].auth_reference): false;
    if  (isThereConcession && isThereEntityInConcession) {
    return true;
    } else {
      // se guardan los datos de concesión y entidad para visualizarlos en
      // la pantalla de unauthorized
      this.accountService.setUnauthorizedConcession(this.concessionSlug, (isThereConcession?true:false));
      this.accountService.setUnauthorizedEntity(this.entityConcessionSlug, (isThereEntityInConcession?true:false));
      this.router.navigate(['/unauthorized'])
      return false;
    }
  }
}
