import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AdminSharedModule } from 'projects/admin/src/app/app.module';
import { LecturasSharedModule } from 'projects/lecturas/src/app/app.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AdminSharedModule.forRoot(),
    LecturasSharedModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
