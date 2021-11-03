import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { AccountComponent } from './account.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { CanActivateConcessionAuthGuard } from '../../core/guards/concessions-grants.guard';

@NgModule({
  imports: [CommonModule, SharedModule, RouterModule.forChild([
    { path: '', component: AccountComponent ,
    }
  ])],
  declarations: [AccountComponent],
  exports: [AccountComponent, RouterModule],
  providers: [DatePipe, DecimalPipe]
})
export class AccountModule {}
