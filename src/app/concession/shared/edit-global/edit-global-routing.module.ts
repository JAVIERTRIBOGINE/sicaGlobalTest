import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditGlobalComponent } from './edit-global.component';


const routes: Routes = [
  { 
  path: '', 
  component: EditGlobalComponent,
  data: {
    test: true
  } 
},
  
]
  ;
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class EditGlobalRoutingModule {}
