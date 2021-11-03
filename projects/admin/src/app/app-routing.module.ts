import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAppComponent } from 'projects/admin/src/app/admin-app.component';
import { TestComponent } from './components/test/test.component';
import { Test2Component } from './components/test2/test2.component';

const routes: Routes = [
  { path: 'admin/test-two', component: Test2Component },
  { path: 'admin/test', component: TestComponent },
  { path: 'admin/sub-home', component: AdminAppComponent },
  // { path: 'admin', redirectTo: '', pathMatch: "full" },

  // { path: 'app2', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
