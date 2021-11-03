import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeleteGlobalComponent } from './delete-global.component';


const routes: Routes = [{ path: '', component: DeleteGlobalComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class ViewGlobalRoutingModule {}
