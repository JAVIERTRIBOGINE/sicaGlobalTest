import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LecturasAppComponent } from 'projects/lecturas/src/app/lecturas-app.component';

const routes: Routes = [
  { path: 'lecturas/sub-home', component: LecturasAppComponent },
  // { path: 'app2', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
