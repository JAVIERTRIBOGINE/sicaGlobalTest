import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'sica-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss'],
})
export class UnauthorizedComponent implements OnInit {
  concessionDatos = {
    value: null,
    check: null,
  };
  entityData = {
    value: null,
    check: null,
  };
  actionData = {
    value: null,
    check: null,
  };
  userName: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private authService: AuthService
  
  ) {
    
    
  }
  
  public ngOnInit(): void {
    this.getUnauthorizedData();

    }
    
    getUnauthorizedData(){
      // -> se mantiene mientras se prueba casos del cpte no autorizado
    // this.userName = this.accountService.getUserDataName();
    // this.concessionDatos = !!this.accountService.getUnauthorizedConcession()?this.accountService.getUnauthorizedConcession(): null;
    // this.entityData = this.accountService.getUnauthorizedEntity();
    // this.actionData = this.accountService.getUnauthorizedAction();
    
  }
  
  get unauthorizedData() {
    return true
    // -> se mantiene por estar en pruebas
    // !!this.concessionDatos
    // || !!this.entityData
    // || !!this.actionData;
  }

  login(): void {
   this.authService.login();
  }
}
