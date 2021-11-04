

import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptorService } from 'src/app/core/interceptors/auth-interceptor.service';
import { SanitizeHtml } from 'src/app/core/pipes/sanitizeHtml';
import { AdminAppComponent } from './core/components/admin-app.component';
import { AppComponent } from './app.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AuthModule, LogLevel, OidcConfigService, OidcSecurityService } from 'angular-auth-oidc-client';
import { environment } from 'src/environments/environment';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION,
  NgxUiLoaderService,
} from 'ngx-ui-loader';

import { DatePipe, DecimalPipe, registerLocaleData } from '@angular/common';
import { CanActivateActionsAuthGuard } from 'src/app/core/guards/actions-grants.guard';
import { CanActivateLoggedGuard } from 'src/app/core/guards/can-activated.guard';
import { CanActivateConcessionAuthGuard } from 'src/app/core/guards/concessions-grants.guard';
import { CanActivateEntitiesAuthGuard } from 'src/app/core/guards/entity-grants.guard';
import { AccountService } from 'src/app/core/services/account.service';
import { DictionaryService } from 'src/app/core/services/dictionary.service';
import { JsonService } from 'src/app/core/services/json.service';


const providers = [JsonService, DictionaryService, OidcSecurityService, AccountService,
  AuthService, TranslateService, NgxUiLoaderService];
  
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
      redirectUrl: environment.urlAdminRedirect,
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
  declarations: [AdminAppComponent, AppComponent],
  imports: [
    AuthModule.forRoot(),
    SharedModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      }
    })
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



@NgModule({  
  declarations: []
})
export class AdminSharedModule{
  static forRoot(): ModuleWithProviders<AppModule> {
    return {
      ngModule: AppModule,
      providers: providers
    }
  }
}

