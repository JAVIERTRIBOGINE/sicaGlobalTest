import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import * as utilsService from 'src/app/core/services/utils.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './language.service';
import { AccountService } from './account.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';



@Injectable({
  providedIn: 'root',
})

export class AuthService {
  accesToken: string;
  tokenData: any;
  isAuthorized: boolean = false;
  constructor(
    private router: Router,
    private apiService: ApiService,
    private oidcSecurityService: OidcSecurityService,
    private account: AccountService,
    private ngxLoader: NgxUiLoaderService
  ) { }

  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    
    this.setAuthorized(false);
    sessionStorage.clear();
    this.oidcSecurityService.logoff();
  }

  getAccessData(url) {
    this.ngxLoader.start();
    this.oidcSecurityService.checkAuth().subscribe(ok => {
      this.oidcSecurityService.isAuthenticated$.subscribe(isAuthorized => {
        if (isAuthorized) {
          // se crea un objeto permissions a partir de los datos 
          // de permisos proporcionados por back
          this.setAuthorized(true);
          this.account.buildPermissionsObject();
          /**TODO hay que cambiar la url a concession/:concession*/
          this.router.navigate([url]);
        }
        else {
          this.router.navigate(['unauthorized']);
        }
      },
        (error) => console.warn(error),
      );
    });
  }

  isLogged(): boolean {
    return this.isAuthorized;
  }

  setAuthorized(autorized) {
    this.isAuthorized = autorized;
  }

}
