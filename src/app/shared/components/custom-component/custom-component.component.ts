import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as constants from 'src/app/core/config/const'

@Component({
  selector: 'sica-custom-component',
  templateUrl: './custom-component.component.html',
  styleUrls: ['./custom-component.component.scss'],
})

/**
 * por herencia es capaz de crear un controlContainer.
 */
export class CustomComponentComponent {
  @Input() flag;
  @Output() onEmitAction: EventEmitter<any> = new EventEmitter<any>();

  zonas = constants.ROUTING_REFERENCES.ZONA;
  rols = constants.ROUTING_REFERENCES.ROLS;

  constructor(
    private router: Router,
    public route: ActivatedRoute
  ) {
  }

  flagValue() {
    return this.flag;
  }

  // para el flag routings-concession-toZone-toRol
  subirDato(event, value: string) {
    event.preventDefault();
    this.onEmitAction.next(value);

  }

  // para el flag customTest
  subirDatoTest(event) {
    event.preventDefault();
    this.onEmitAction.next('testing');  
  }

}
