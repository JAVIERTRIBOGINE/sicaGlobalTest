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
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'admin';
  items: MenuItem[] = []
  routerSubscription: any;

  constructor(
  ) {

  }
  ngOnInit() {
  }  
}
