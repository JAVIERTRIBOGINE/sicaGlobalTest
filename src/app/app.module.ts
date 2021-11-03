import { AdminSharedModule } from 'projects/admin/src/app/app.module';
import { LecturasSharedModule } from 'projects/lecturas/src/app/app.module';


import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { SharedModule } from './shared/shared.module';
import { AuthInterceptorService } from './core/interceptors/auth-interceptor.service';
import { CanActivateLoggedGuard } from './core/guards/can-activated.guard';
import { CanActivateActionsAuthGuard } from './core/guards/actions-grants.guard';
import { CanActivateConcessionAuthGuard } from './core/guards/concessions-grants.guard';
import { SanitizeHtml } from 'src/app/core/pipes/sanitizeHtml';

import { AuthService } from './core/services/auth.service';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AuthModule, LogLevel, OidcConfigService } from 'angular-auth-oidc-client';
import { environment } from 'src/environments/environment';
import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION,
} from 'ngx-ui-loader';
import { CanActivateEntitiesAuthGuard } from './core/guards/entity-grants.guard';
import { DatePipe, DecimalPipe, registerLocaleData } from '@angular/common';
import localeEsEs from '@angular/common/locales/es';
import localeEsMx from '@angular/common/locales/es-MX';
import localeCaEs from '@angular/common/locales/ca';


// registramos locales
registerLocaleData(localeEsEs, 'es-Es');
registerLocaleData(localeEsMx, 'es-Mx');
registerLocaleData(localeCaEs, 'ca-Es');

/**
 * función de configuración de la libreria ngx-loader (traducciones)
 * ... Define ruta de los archivos de traducción y protocolo de llamadas (http)
 * @param http 
 * @returns 
 */
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/json/i18n/', '.json');
}

/**
 * constantes de configuración de la librería ngx-ui-loader 
 * ... ( la que gestiona los tiempos de espera)
 */
const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsColor: '#2196f3',
  bgsPosition: POSITION.centerCenter,
  bgsSize: 40,
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 5, // progress bar thickness,
  pbColor: '#2196f3',
  "hasProgressBar": false,
};

/**
 * función de configuración de la librería auth-oid, que 
 * ... se conecta con el identity server 4
 * @param oidcConfigService 
 * @returns 
 */
export function configureAuth(oidcConfigService: OidcConfigService) {
  return () =>
    oidcConfigService.withConfig({
      stsServer: environment.authUrl,
      redirectUrl: environment.urlRedirect,
      postLoginRoute: environment.urlRedirect + '/home',
      postLogoutRedirectUri: environment.urlRedirect + '/logout',
      unauthorizedRoute: environment.urlRedirect + '/unauthorized',
      clientId: 'angular_spa',
      scope: 'openid profile RedHidraulica Account Concesion Global',
      responseType: 'code',
      silentRenew: true,
      renewTimeBeforeTokenExpiresInSeconds: 200,
      silentRenewUrl: `${window.location.origin}/src/app/silent-renew.html`,
      logLevel: LogLevel.Debug,
    });
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    AuthModule.forRoot(),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    DashboardModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      }
    }),
    AdminSharedModule.forRoot(),
    LecturasSharedModule.forRoot()
  ],
  providers: [
    SanitizeHtml,
    DatePipe,
    DecimalPipe,
    AuthService,
    CanActivateLoggedGuard,
    CanActivateActionsAuthGuard,
    CanActivateConcessionAuthGuard,
    CanActivateEntitiesAuthGuard,
    OidcConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: configureAuth,
      deps: [OidcConfigService],
      multi: true,
    },
    TranslateService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
}


