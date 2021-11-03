import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterStateSnapshot } from '@angular/router';
import * as constants from 'src/app/core/config/const'
import { CanActivate } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { AccountService } from '../services/account.service';

@Injectable()
export class CanActivateActionsAuthGuard implements CanActivate {
  concessionSlug;
  staticConcession;
  entityConcessionSlug
  idRow: string = null;
  actionOfEntity: string = null;
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
   * @returns evaluación si los concesión-entidad-acción están en this.permissions
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    //trocea la url en sus slugs
    let validUrl = state.url.split('/');
    validUrl.splice(0, 1);
    // se asignan los slugs de la url en variables
    [this.staticConcession, this.concessionSlug, this.entityConcessionSlug, this.idRow, this.actionOfEntity] = validUrl;
    //si no hay slug de acción, es el de visualización de un registro
    if (!this.actionOfEntity) this.actionOfEntity = "read";
    //evalúa 
    let isThereConcession = this.accountService.getAllowedConcessions().find(allowedConc => allowedConc.value === this.concessionSlug);
    let allowedEntities = this.accountService.getAllowedEntitesByConcession(this.concessionSlug);
    let isThereEntityInConcession = !!allowedEntities ? allowedEntities.includes(constants.ENTITY_REFERENCES[this.entityConcessionSlug.toUpperCase()].auth_reference) : false;
    let isThereActionInConcession = this.accountService.isThereAllowedActionsOfEntity(this.concessionSlug, constants.ENTITY_REFERENCES[this.entityConcessionSlug.toUpperCase()].auth_reference, this.actionOfEntity) || this.isHistoric;
    if (isThereConcession && isThereEntityInConcession && isThereActionInConcession) {
      return true;
    }
    else {
      this.accountService.setUnauthorizedConcession(this.concessionSlug, (isThereConcession ? true : false));
      this.accountService.setUnauthorizedEntity(this.entityConcessionSlug, (isThereEntityInConcession ? true : false));
      this.accountService.setUnauthorizedAction(this.actionOfEntity, (isThereActionInConcession ? true : false));
      // de momento comento la evaluación
      this.router.navigate(['/unauthorized'])
      return true;
    }
  }

  get isHistoric(){
    return this.actionOfEntity === 'historic'
  }
}
