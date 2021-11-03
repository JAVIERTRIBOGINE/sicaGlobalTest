import { Component, OnInit } from '@angular/core';
import { TestServiceService } from 'src/app/test-services/test-service.service';
import { TestTwoService } from 'src/app/test-services/test-two.service';

@Component({
  selector: 'app-test2',
  templateUrl: './test2.component.html',
  styleUrls: ['./test2.component.scss']
})
export class Test2Component implements OnInit {

  constructor(private serviceTestTwo: TestTwoService) { }

  ngOnInit(): void {
  }

  testeandoServ2(){
      this.serviceTestTwo.loggingTwo();
  }

}
