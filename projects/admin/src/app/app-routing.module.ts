import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAppComponent } from 'projects/admin/src/app/admin-app.component';

const routes: Routes = [
  { path: 'admin/home', component: AdminAppComponent },
  // { path: 'admin', redirectTo: '', pathMatch: "full" },

  // { path: 'app2', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
