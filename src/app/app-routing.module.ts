import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CanActivateConcessionAuthGuard } from './core/guards/concessions-grants.guard';
import { CanActivateLoggedGuard } from './core/guards/can-activated.guard';
import * as constants from 'src/app/core/config/const'
import { AppComponent } from './app.component';


const routes: Routes = [
  {
    path: 'unauthorized',
    loadChildren: () =>
      import('./core/modules/unauthorized/unauthorized.module').then((m) => m.UnauthorizedModule)
  },
  {
    path: constants.contextSlug.DASHBOARD,
    loadChildren: () =>
      import('./dashboard/dashboard.module').then(
        (m) => m.DashboardModule,
      ),
    canActivate: [CanActivateLoggedGuard]
  },
   // routa al modulo que pinta la home de la concesión
   {
    path: constants.contextSlug.ADMIN,
    loadChildren: () =>
      import('src/app/admin/admin.module').then((m) => m.AdminModule),
    canActivate: [CanActivateLoggedGuard/*, CanActivateConcessionAuthGuard*/]
  },
  // routa al modulo que pinta la home de la concesión
  {
    path: constants.contextSlug.CONCESSION + "/" + constants.ROUTING_PARAMETERS_REFERENCES.CONCESION,
    loadChildren: () =>
      import('src/app/concession/concession.module').then((m) => m.ConcesssionHomeModule),
    canActivate: [CanActivateLoggedGuard, CanActivateConcessionAuthGuard]
  },
  {
    path: 'lecturas',
    loadChildren: () =>
      import('projects/lecturas/src/app/app.module').then((m) => m.LecturasSharedModule)
  },
  // {path: '**', redirectTo: "admin", pathMatch: "full"}
  {
    path: 'admin',
    loadChildren: () =>
      import('projects/admin/src/app/app.module').then((f )=> f.AdminSharedModule)
  },
  // {
  //   path: '**',
  //   redirectTo: 'unauthorized',
  //   pathMatch: "full"
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),

  ],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule { }

