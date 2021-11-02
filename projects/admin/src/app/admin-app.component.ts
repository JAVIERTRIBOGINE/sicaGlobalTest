import { Component } from '@angular/core';
import { TestServiceService } from 'src/app/services/test-service.service';

@Component({
  selector: 'admin-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AdminAppComponent {
  title = 'admin';

  constructor(private testService: TestServiceService){
    this.testService.consoling();
  }

  
}
