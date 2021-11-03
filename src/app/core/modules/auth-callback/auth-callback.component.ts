import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Catalog } from '../../models/other-interfaces';
import { AuthService } from '../../services/auth.service';
import { DictionaryService } from '../../services/dictionary.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'sica-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.scss'],
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private dictionaryService: DictionaryService,
    private ngxLoader: NgxUiLoaderService
  ) {}

  public ngOnInit(): void {

    this.authService.getAccessData('/home'); 
  }
}
