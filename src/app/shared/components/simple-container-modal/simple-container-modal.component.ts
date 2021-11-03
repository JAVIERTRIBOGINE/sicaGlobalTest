
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';


@Component({
  selector: 'sica-simple-container-modal',
  templateUrl: './simple-container-modal.component.html',
  styleUrls: ['./simple-container-modal.component.scss'],
})

/**
 * por herencia es capaz de crear un controlContainer.
 */
export class SimpleContainerModalComponent implements OnInit {
  data: object = null;
  constructor(
    public route: ActivatedRoute,
    public config: DynamicDialogConfig
  ) {
  }

  ngOnInit() {
    this.data = this.config.data
  }


}
