import { Component, OnInit } from '@angular/core';
import { TestTwoService } from 'src/app/services/test-two.service';

@Component({
  selector: 'app-shared-component',
  templateUrl: './shared-component.component.html',
  styleUrls: ['./shared-component.component.scss']
})
export class SharedComponentComponent implements OnInit {

  constructor(private testTwoService: TestTwoService ) { }

  ngOnInit(): void {
  }

  testClick(){
    this.testTwoService.loggingTwo();
  }

}
