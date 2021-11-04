import { Component, OnInit } from '@angular/core';
import * as adminConstants from 'projects/admin/src/app/core/config/admin-const'
import * as constants from 'projects/admin/src/app/core/config/const'
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AccountService } from 'src/app/core/services/account.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './admin-app.component.html',
  styleUrls: ['./admin-app.component.scss']
})
export class AdminAppComponent implements OnInit{
  title = 'admin';
  items: MenuItem[] = []
  routerSubscription: any;

  constructor(
    public oidcSecurityService: OidcSecurityService,
    private accountService: AccountService,
    private authService: AuthService,
    public translate: TranslateService,
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private route: ActivatedRoute,
    private ngxLoader: NgxUiLoaderService
  ) {

    this.routerSubscription = this.router.events.subscribe(e => {
      
      if (e instanceof NavigationStart) 
        if (!sessionStorage.getItem('realUrl')) sessionStorage.setItem('realUrl', e.url);
    });
    this.translate.addLangs([constants.LANGUAGES.SPANISH, constants.LANGUAGES.CATALAN]);
    this.translate.setDefaultLang(constants.LANGUAGES.SPANISH);
  }
  ngOnInit() {
    // se aplica este control por las recargas de página (no pasaran por el )
    // ids4
    this.fillItems();
    this.oidcSecurityService.isAuthenticated$.subscribe(auth => {
      if (!auth) {
        this.ngxLoader.start();
        this.oidcSecurityService.checkAuth().subscribe(ok => {
          if (ok) {
            
            this.authService.setAuthorized(true);
            this.accountService.buildPermissionsObject();

            // this.router.navigate(["/" + sessionStorage.getItem('realUrl')]); ** se mantiene
            if (!!sessionStorage.getItem('realUrl')) this.router.navigate([sessionStorage.getItem('realUrl')]);

          } else {
            this.oidcSecurityService.authorize();
          }
        },
          er => console.warn('error en checkauth: ', er),
          () => this.ngxLoader.stop()
        );
      } 
    })

    if (!!sessionStorage.getItem('angular_spa_userData')) {
      this.authService.setAuthorized(true);
      this.accountService.buildPermissionsObject();

    }
    this.primengConfig.ripple = true;

  }

  fillItems(){
    this.items.push(
      {
        label: "multilanguage", 
       routerLink: "/" + constants.contextSlug.ADMIN + "/" + constants.ROUTING_REFERENCES.MULTILENGUAGE + "/" + constants.Actions.EDIT 
    })
  }

  get devMode() {
    return adminConstants.devMode;
  }

  get concessionSelected() {
    return true;
  }
  
}
