import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnauthorizedComponent } from './unauthorized.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';

@NgModule({
  imports: [CommonModule, SharedModule, CardModule, RouterModule.forChild([
    { path: '', component: UnauthorizedComponent }
  ])],
  declarations: [UnauthorizedComponent],
  exports: [],
})
export class UnauthorizedModule {}
