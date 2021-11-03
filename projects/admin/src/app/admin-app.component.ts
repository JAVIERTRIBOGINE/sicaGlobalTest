import { Component } from '@angular/core';
import { TestServiceService } from 'src/app/test-services/test-service.service';
import * as adminConstants from 'projects/admin/src/app/core/config/admin-const'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AdminAppComponent {
  title = 'admin';

  constructor(private testService: TestServiceService){
  }

  get devMode() {
    return adminConstants.devMode;
  }

  get concessionSelected() {
    return true;
  }
  
}
