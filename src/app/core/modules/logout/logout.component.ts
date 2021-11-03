import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss'],
})
export class LogoutComponent implements OnInit {

  constructor(
  private authService: AuthService
  ) {}

  public ngOnInit(): void {
  }

 

  login(): void {
    this.authService.login();
  }
}
