import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class LanguageService {
  language$: Subject<string>= new Subject<string>();
  constructor(private translate: TranslateService) {}
  language: string = "es";
  

  setLanguage(lang: string) {
    this.language = lang;
    this.language$.next(lang);
  }

  getLanguage() {
    return this.language;
  }

  watchLanguage(){
    return this.language$.asObservable();
  }
}
