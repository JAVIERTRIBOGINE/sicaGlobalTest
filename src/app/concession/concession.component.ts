import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LanguageService } from 'src/app/core/services/language.service';

@Component({
  selector: 'sica-concession-home',
  templateUrl: './concession.component.html',
  styleUrls: ['./concession.component.scss'],
})
export class ConcessionComponent implements OnInit, OnDestroy {
  subsLan$: Subscription = new Subscription();
  subsTranslate$: Subscription = new Subscription();
  translate: any;
  columns: any[];
  jsonData: any;
  language$: Observable<string>;


  constructor() {
  }

  ngOnInit(): void {
    sessionStorage.removeItem('realUrl');
  }

  ngOnDestroy(): void {
  }
}
