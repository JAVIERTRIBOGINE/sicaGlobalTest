import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from './logout.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, SharedModule, RouterModule.forChild([
    { path: '', component: LogoutComponent }
  ])],
  declarations: [LogoutComponent],
  exports: [],
})
export class LogoutModule {}
