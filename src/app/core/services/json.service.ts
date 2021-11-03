import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { rootFormsDir } from 'src/app/core/config/const'
import { async } from '@angular/core/testing';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root'
})

export class JsonService {
  formProperties: any = {};
  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private languageService: LanguageService
    ) {}


  public readAllFile(dirRoute: string){
    return this.apiService.readJson(dirRoute);
  }

  loadForms(action: string, entity: string): Observable<any>{
    let dirRoute = rootFormsDir+entity+'/'+[entity,action].join('_')+'.json';
    return this.apiService.readJson(dirRoute);
  }
}
