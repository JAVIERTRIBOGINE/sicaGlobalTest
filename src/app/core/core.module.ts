import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './modules/login/login.component';
import { LoginModule } from './modules/login/login.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, LoginModule],
  exports: [LoginModule]
})
export class CoreModule {}
