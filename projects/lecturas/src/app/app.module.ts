import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { LecturasAppComponent } from './lecturas-app.component';
import { SharedModuleModule } from 'src/app/modules/shared-module/shared-module.module'

// const providers = [];


@NgModule({
  declarations: [
    LecturasAppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModuleModule
  ],
  exports: [LecturasAppComponent],
  providers: [],
  bootstrap: [LecturasAppComponent]
})
export class AppModule { }

@NgModule({})
export class LecturasSharedModule{
  static forRoot(): ModuleWithProviders<AppModule> {
    return {
      ngModule: AppModule,
      providers: []
    }
  }
}
