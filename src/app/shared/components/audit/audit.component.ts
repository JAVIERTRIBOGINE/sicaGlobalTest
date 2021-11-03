import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuditDataModel, DataModel } from '../../models/audit';
import { Location } from '@angular/common';

@Component({
  selector: 'sica-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent implements OnInit {

  @Input() data: AuditDataModel[]

  actual: AuditDataModel;
  actualOptions: string[] = [];
  historicSelected: AuditDataModel;
  historicSelector: string;
  historicOptions: string[] = [];
  historicAction: string;

  constructor(
    private translate: TranslateService,
    private location: Location
    ) { }

  ngOnInit(): void {

    this.data?.sort((a,b) => {
      return new Date(b?.selector)?.getDate() - new Date(a?.selector)?.getDate();
    });

    if(this.data)
      this.actual = this.data[0];

    this.data.forEach((d, index) => {
        this.actualOptions.push(d.selector);
    })

    this.updateSelected(this.actual.selector, 1);
  }

  updateSelected(value: string, dropDown: number){
    if(dropDown === 1) {
      this.actual = this.data?.find(d => d?.selector === value);
      const next = this.data?.filter(d => d?.selector < value);
      this.historicSelected = next?.length !==0 ? next[0] : null;
      this.historicSelector = this.historicSelected?.selector;
      this.historicAction = this.historicSelected?.action;
      this.historicOptions = [];
      next.forEach(n => this.historicOptions?.push(n?.selector));
    }

    else if(dropDown === 2){
      this.historicSelected = this.data?.find(d => d?.selector == value);
      this.historicAction = this.historicSelected?.action;
      this.historicSelector = this.historicSelected?.selector;
    }
  }

  action(data: DataModel, action: string): boolean {
    if(this.historicAction == action && this.actual?.data?.find(a => a?.name == data?.name)?.value != data?.value) {
        return true;
    }
    return false;
  }

  back(){
    this.location.back();
  }
}
