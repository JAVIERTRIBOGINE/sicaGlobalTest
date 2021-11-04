import {  ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TestServiceService } from 'src/app/test-services/test-service.service'
import { AppRoutingModule } from './app-routing.module';
import { AdminAppComponent } from './admin-app.component';
import { TestTwoService } from 'src/app/test-services/test-two.service';

const providers = [TestServiceService, TestTwoService];

@NgModule({  
  declarations: []
})
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
    AppRoutingModule
  ],
  providers: providers,
  exports: [AdminAppComponent],

  bootstrap: [AdminAppComponent]
})
export class AppModule { }

