import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateConcessionAuthGuard } from '../core/guards/concessions-grants.guard';
import { DashboardComponent } from './dashboard.component';
import { TableComponent } from '../shared/components/table/table.component';
import * as constants from 'src/app/core/config/const';
import { CanActivateLoggedGuard } from '../core/guards/can-activated.guard';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [
      {
        path: constants.ROUTING_REFERENCES.HOME,
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
        canActivate: [CanActivateLoggedGuard]
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class DashboardRoutingModule { }
