import {  ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TestServiceService } from 'src/app/services/test-service.service'
import { AppRoutingModule } from './app-routing.module';
import { AdminAppComponent } from './admin-app.component';
import { SharedModuleModule } from 'src/app/modules/shared-module/shared-module.module';
import { TestTwoService } from 'src/app/services/test-two.service';

const providers = [TestServiceService, TestTwoService];

@NgModule({})
export class AdminSharedModule{
  static forRoot(): ModuleWithProviders<AppModule> {
    return {
      ngModule: AppModule,
      providers: providers
    }
  }
}
@NgModule({
  declarations: [
    AdminAppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModuleModule
  ],
  providers: providers,
  exports: [AdminAppComponent],

  bootstrap: [AdminAppComponent]
})
export class AppModule { }

