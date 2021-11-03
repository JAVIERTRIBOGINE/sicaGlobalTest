import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConcessionComponent } from './concession.component';
import * as constants from 'src/app/core/config/const';
import { CanActivateLoggedGuard } from '../core/guards/can-activated.guard';
import { CanActivateActionsAuthGuard } from '../core/guards/actions-grants.guard';
import { CanActivateConcessionAuthGuard } from '../core/guards/concessions-grants.guard';
import { CanActivateEntitiesAuthGuard } from '../core/guards/entity-grants.guard';

const routes: Routes = [
  {
    path: '', component: ConcessionComponent,
    canActivate: [CanActivateLoggedGuard],
    children: [
      // Edit de identificador de contexto (concesion)-> ej: concession/monte-frio/edit
      {
        path: constants.Actions.EDIT,
        loadChildren: () =>
          import('src/app/concession/shared/edit-global/edit-global.module').then((m) => m.EditGlobalModule),
        data: {
          module: "edit"
        },
        canActivate: [CanActivateLoggedGuard, CanActivateConcessionAuthGuard]
      },
      // listado de entidad contextualizada -> ej: 'concession/monte-frio/lecturas'
      {
        path: constants.ROUTING_PARAMETERS_REFERENCES.ENTITY,
        loadChildren: () =>
          import('src/app/concession/shared/search-global/search-global.module').then((m) => m.SearchGlobalModule),
        data: {
          module: "search"
        },
      },
      // listado de entidad contextualizada a otra entidad -> ej: 'concession/monte-frio/gestor-procesos/ejecucion-procesos'
      {
        path: constants.ROUTING_PARAMETERS_REFERENCES.ENTITYPARENT + "/" + constants.ROUTING_PARAMETERS_REFERENCES.ENTITY,
        loadChildren: () =>
          import('src/app/concession/shared/search-global/search-global.module').then((m) => m.SearchGlobalModule),
        data: {
          module: "search"
        },
      },
      // creación de entidad contextualizada -> ej: 'concession/monte-frio/lecturas/create'
      {
        path: constants.ROUTING_PARAMETERS_REFERENCES.ENTITY + "/" + constants.Actions.CREATE,
        loadChildren: () =>
          import('src/app/concession/shared/edit-global/edit-global.module').then((m) => m.EditGlobalModule)
      },
      // CRUD PUT de entidad
      {
        path: constants.ROUTING_PARAMETERS_REFERENCES.ENTITY + "/" + constants.ROUTING_PARAMETERS_REFERENCES.ID_REGISTER + "/" + constants.Actions.DETAIL,
        loadChildren: () =>
          import('src/app/concession/shared/view-global/view-global.module').then((m) => m.ViewGlobalModule),
        canActivate: [CanActivateLoggedGuard/*, CanActivateActionsAuthGuard*/]
      },
      {
        path: constants.ROUTING_PARAMETERS_REFERENCES.ENTITY + "/" + constants.ROUTING_PARAMETERS_REFERENCES.ID_REGISTER + "/" + constants.Actions.EDIT,
        loadChildren: () =>
          import('src/app/concession/shared/edit-global/edit-global.module').then((m) => m.EditGlobalModule),
        canActivate: [CanActivateLoggedGuard, CanActivateActionsAuthGuard]
      },
      // AUDIT de entidad
      {
        path: constants.ROUTING_PARAMETERS_REFERENCES.ENTITY + "/" + constants.ROUTING_PARAMETERS_REFERENCES.ID_REGISTER + "/" + constants.Actions.AUDIT,
        loadChildren: () =>
          import('src/app/concession/shared/historic/historic.module').then((m) => m.HistoricModule),
      },
      // CRUD DELETE  de entidad
      {
        path: constants.ROUTING_PARAMETERS_REFERENCES.ENTITY + "/" + constants.ROUTING_PARAMETERS_REFERENCES.ID_REGISTER + "/" + constants.Actions.DELETE,
        loadChildren: () =>
          import('src/app/concession/shared/delete-global/delete-global.module').then((m) => m.DeleteGlobalModule),
        canActivate: [CanActivateLoggedGuard, CanActivateActionsAuthGuard]
      },
      // CRUD PUT de entidad
      {
        path: constants.ROUTING_PARAMETERS_REFERENCES.ENTITYPARENT + "/" + constants.ROUTING_PARAMETERS_REFERENCES.ENTITY + "/" + constants.ROUTING_PARAMETERS_REFERENCES.ID_REGISTER + "/" + constants.Actions.DETAIL,
        loadChildren: () =>
          import('src/app/concession/shared/view-global/view-global.module').then((m) => m.ViewGlobalModule),
        canActivate: [CanActivateLoggedGuard/*, CanActivateActionsAuthGuard*/]
      }

    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class ConcessionHomeRoutingModule { }
