import { Component, OnInit } from '@angular/core';
import { TestServiceService } from 'src/app/test-services/test-service.service';
import * as adminConstants from 'projects/admin/src/app/core/config/admin-const'
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './admin-app.component.html',
  styleUrls: ['./admin-app.component.scss']
})
export class AdminAppComponent implements OnInit{
  title = 'admin';
  items: MenuItem[] = []

  constructor(private testService: TestServiceService){
  }

  ngOnInit(){
    this.fillItems()
  }

  fillItems(){
    this.items.push(
      {
        label: "multilanguage", 
       routerLink: "/admin/multi-language"       
    })
  }

  get devMode() {
    return adminConstants.devMode;
  }

  get concessionSelected() {
    return true;
  }
  
}
