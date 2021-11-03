import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchGlobalComponent } from './search-global.component';


const routes: Routes = [{ path: '', component: SearchGlobalComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class SearchGlobalRoutingModule {}
