import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AccountService } from '../core/services/account.service';

@Component({
  selector: 'sica-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, OnDestroy {
  subsRepo: Subscription = new Subscription();
  showReporting$: Observable<boolean>;
  showRepoScreen: boolean=false;
  constructor(private accountService: AccountService) {
    this.showReporting$ = this.accountService.matchShowReporting();
    this.subsRepo = this.showReporting$.subscribe(showReport=>this.showRepoScreen=showReport);
  }

  ngOnInit(): void {
    sessionStorage.removeItem('realUrl');
  }

  get showReport() {
    return this.showRepoScreen;
  }

  ngOnDestroy():void {
    this.subsRepo.unsubscribe();
  }
}
