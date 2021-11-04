import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateConcessionAuthGuard } from '../core/guards/concessions-grants.guard';
import { AdminComponent } from './admin.component';
import { TableComponent } from '../shared/components/table/table.component';
import * as constants from 'src/app/core/config/const';
import { CanActivateLoggedGuard } from '../core/guards/can-activated.guard';

const routes: Routes = [
  { path: '', component: AdminComponent,
    children: [     
  
      {
        path: constants.ROUTING_PARAMETERS_REFERENCES.ADMIN_ENTITY + "/" + constants.ROUTING_PARAMETERS_REFERENCES.ADMIN_SUBENTITY,
        loadChildren: () =>
        import('src/app/concession/shared/search-global/search-global.module').then((m) => m.SearchGlobalModule),
        canActivate: [CanActivateLoggedGuard]
      },
      {
        path: constants.ROUTING_PARAMETERS_REFERENCES.ADMIN_ENTITY + "/" + constants.ROUTING_PARAMETERS_REFERENCES.ADMIN_SUBENTITY + "/" + constants.ROUTING_PARAMETERS_REFERENCES.ID_REGISTER + "/" + constants.Actions.DETAIL,
        loadChildren: () =>
        import('src/app/concession/shared/view-global/view-global.module').then((m) => m.ViewGlobalModule),
        canActivate: [CanActivateLoggedGuard]
      },
      {
        path: constants.ROUTING_PARAMETERS_REFERENCES.ADMIN_ENTITY + "/" + constants.ROUTING_PARAMETERS_REFERENCES.ADMIN_SUBENTITY + "/" + constants.ROUTING_PARAMETERS_REFERENCES.ID_REGISTER + "/" + constants.Actions.EDIT,
        loadChildren: () =>
        import('src/app/concession/shared/edit-global/edit-global.module').then((m) => m.EditGlobalModule),
        canActivate: [CanActivateLoggedGuard]
      },
      {
        path: constants.ROUTING_PARAMETERS_REFERENCES.ADMIN_ENTITY + "/" + constants.ROUTING_PARAMETERS_REFERENCES.ADMIN_SUBENTITY + "/" + constants.Actions.CREATE,
        loadChildren: () =>
        import('src/app/concession/shared/edit-global/edit-global.module').then((m) => m.EditGlobalModule),
        canActivate: [CanActivateLoggedGuard]
      },
      {
        path: constants.ROUTING_USER_BASE + "/" + constants.Actions.EDIT,
        loadChildren: () =>
        import('src/app/admin/account/account.module').then(
          (m) => m.AccountModule,
          ),
        },
        { path: '', redirectTo: 'home', pathMatch: 'full'}
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class AdminRoutingModule {}
