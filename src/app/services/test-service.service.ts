import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TestServiceService {

  constructor() { }

  consoling() {
    console.log("confirmado: llega");
    
  }
}
