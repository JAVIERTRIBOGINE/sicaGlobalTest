import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
