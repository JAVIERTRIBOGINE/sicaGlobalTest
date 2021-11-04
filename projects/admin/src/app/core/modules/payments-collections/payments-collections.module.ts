import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentsCollectionsComponent } from './payments-collections.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { CardModule } from 'primeng/card';
import { Route } from '@angular/compiler/src/core';
import { DragDropComponent } from 'src/app/shared/components/dragDrop/dragDrop.component';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { FormsNgModule } from 'src/app/shared/components/formsNg/formsNg.module';
import { SearchFormsNgModule } from 'src/app/shared/components/search-formsNg/search-formsNg.module';


const route: Routes = [
  { 
    path: '', component: PaymentsCollectionsComponent
 }
]

@NgModule({
  imports: [SearchFormsNgModule, FormsNgModule, ToastModule, ButtonModule, CommonModule, SharedModule, CardModule, RouterModule.forChild(
  route
  )],
  declarations: [DragDropComponent, PaymentsCollectionsComponent],
  exports: [],
})
export class PaymentsCollectionsModule {}
