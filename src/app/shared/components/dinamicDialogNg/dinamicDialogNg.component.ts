import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';


@Component({
  selector: 'sica-dynamicDialog',
  templateUrl: './dinamicDialogNg.component.html',
  styleUrls: ['./dinamicDialogNg.component.scss'],
  providers:  [ MessageService, DialogService, DynamicDialogRef]
})
export class DinamicDialogNgComponent implements OnInit {
  
  modal: DynamicDialogRef;
  constructor( 
    public dialogService: DialogService,
    public dialogRef: DynamicDialogRef,
    public messageService: MessageService
    ) {}

  ngOnInit(): void {
    
  }



ngOnDestroy() {
  if (this.dialogRef) {
      this.dialogRef.close();
  }
}
  
}
