import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewGlobalComponent } from './view-global.component';


const routes: Routes = [{ path: '', component: ViewGlobalComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class ViewGlobalRoutingModule {}
