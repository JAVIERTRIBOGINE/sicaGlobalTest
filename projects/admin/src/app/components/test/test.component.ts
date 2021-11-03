import { Component, OnInit } from '@angular/core';
import { TestServiceService } from 'src/app/test-services/test-service.service';
import { TestTwoService } from 'src/app/test-services/test-two.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  constructor(private testService: TestServiceService) { }

  ngOnInit(): void {
  }

  testeandoServ1(){
    this.testService.consoling();
  }

}
