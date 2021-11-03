import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthCallbackComponent } from './auth-callback.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [CommonModule, SharedModule, TranslateModule.forChild(), RouterModule.forChild([
    { path:'', component: AuthCallbackComponent }
  ])],
  declarations: [AuthCallbackComponent],
  exports: [],
})
export class AuthCallBackModule {}
