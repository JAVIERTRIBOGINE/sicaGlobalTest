import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { CanActivateConcessionAuthGuard } from '../../guards/concessions-grants.guard';

@NgModule({
  imports: [CommonModule, SharedModule, RouterModule.forChild([
    { path: '', component: LoginComponent ,
    }
  ])],
  declarations: [LoginComponent],
  exports: [LoginComponent, RouterModule],
})
export class LoginModule {}
