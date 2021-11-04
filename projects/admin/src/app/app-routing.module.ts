import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAppComponent } from 'projects/admin/src/app/admin-app.component';
import * as constants from './core/config/const'

const routes: Routes = [
  
  { path: 'admin/sub-home', component: AdminAppComponent },
  {
    path: 'lecturas',
    loadChildren: () =>
      import('projects/lecturas/src/app/app.module').then((m) => m.LecturasSharedModule)
  },
  {
    path: constants.contextSlug.ADMIN + "/" + constants.ROUTING_REFERENCES.CONCILIATIONS,
    loadChildren: () =>
      import('projects/admin/src/app/core/modules/payments-collections/payments-collections.module').then(
        (m) => m.PaymentsCollectionsModule,
      ),
    // canActivate: [CanActivateLoggedGuard]
  },
  {
    path: constants.contextSlug.ADMIN + "/" + constants.ROUTING_REFERENCES.MULTILENGUAGE + "/" + constants.Actions.EDIT ,
    loadChildren: () =>
      import('projects/admin/src/app/core/modules/multi-language/multi-language.module').then(
        (m) => m.MultiLanguageModule,
      ),
    // canActivate: [CanActivateLoggedGuard]
  },
  // { path: 'admin', redirectTo: '', pathMatch: "full" },

  // { path: 'app2', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
