import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as constants from 'src/app/core/config/const';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})

/**
 * This service is used to send data by observables
 * This data is created by a form, whis is configured by a object readen in a json file
 */
export class CustomMessageService {
  toastMessage: any = null;

  constructor(
    private translate: TranslateService
  ) {

  }

  /**
   * Se conforman los mensajes toast en las acciones CRUD
   * @param data 
   * @param action 
   * @param state 
   */
  buildToastMessage(data, action, state) {
    let dataMessage;
    let messageParams;
    switch (action) {
      case "INSERT":
        switch (state) {
          case "SUCCESS":
            messageParams = {
              ":idRow": !!data?data.data.id:'',
              ":idConcesion": data.data.concesionId
            };
            dataMessage = {
              severity: constants.severityToast.SUCCESS,
              summary: this.translate.instant("GENERAL.MESSAGES.TITLE.INSERT_SUCCESS"),
              detail: this.translate.instant("GENERAL.MESSAGES.BODY.INSERT_SUCCESS", messageParams)
            }
            this.setToastMessage(dataMessage);
            break;

          case "ERROR":
            dataMessage = {
              severity: constants.severityToast.ERROR,
              summary: this.translate.instant("GENERAL.MESSAGES.TITLE.INSERT_FAIL"),
              detail: this.translate.instant("GENERAL.MESSAGES.BODY.INSERT_FAIL") + data.message
            }
            this.setToastMessage(dataMessage);
            break;
        }
        break;
      case "EDIT":
        switch (state) {
          case "SUCCESS":
            messageParams = {
              ":idRow": !!data?data.data.id:'',
              ":idConcesion": data.data.concesionId
            };
            dataMessage = {
              severity: constants.severityToast.SUCCESS,
              summary: this.translate.instant("GENERAL.MESSAGES.TITLE.EDIT_SUCCESS"),
              detail: this.translate.instant("GENERAL.MESSAGES.BODY.EDIT_SUCCESS", messageParams)
            }
            this.setToastMessage(dataMessage);
            break;

          case "ERROR":
            dataMessage = {
              severity: constants.severityToast.ERROR,
              summary: this.translate.instant("GENERAL.MESSAGES.TITLE.EDIT_FAIL"),
              detail: this.translate.instant("GENERAL.MESSAGES.BODY.EDIT_FAIL") + data.message
            }
            this.setToastMessage(dataMessage);
            break;
        }
        break;
      case "DELETE":
        switch (state) {
          case "SUCCESS":
            messageParams = {
              ":idRow": data.id,
              ":idConcesion": data.concesionId
            };
            dataMessage = {
              severity: constants.severityToast.SUCCESS,
              summary: this.translate.instant("GENERAL.MESSAGES.TITLE.DELETE_SUCCESS"),
              detail: this.translate.instant("GENERAL.MESSAGES.BODY.DELETE_SUCCESS", messageParams)
            }
            this.setToastMessage(dataMessage);
            break;

          case "ERROR":
            dataMessage = {
              severity: constants.severityToast.ERROR,
              summary: this.translate.instant("GENERAL.MESSAGES.TITLE.DELETE_FAIL"),
              detail: this.translate.instant("GENERAL.MESSAGES.BODY.DELETE_FAIL") + data.message
            }
            this.setToastMessage(dataMessage);
            break;
        }
        break;
    }
  }

  getToastMessage() {
    return this.toastMessage;
  }

  clearToastMessage() {
    this.toastMessage = null;
  }

  setToastMessage(message) {
    this.toastMessage = message;
  }
}