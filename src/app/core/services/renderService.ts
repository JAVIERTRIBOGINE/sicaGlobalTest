import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { LanguageService } from './language.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { AccountService } from './account.service';
import { DictionaryService } from './dictionary.service';



@Injectable({
  providedIn: 'root'
})

export class RenderService {

  constructor(
    private apiServie: ApiService,
    private languageService: LanguageService,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
    private accountService: AccountService,
    public dictionaryService: DictionaryService
  ) {

  }

  isCheck(colKey, colData, dataFields){
    let selectedField = dataFields.find(field => field['DTO'] === colKey);
    return !! selectedField.render && selectedField.render === "checkbox"; 
  }

  isLink(colKey, colData, dataFields){
    let selectedField = dataFields.find(field => field['DTO'] === colKey);
    return !! selectedField.render && selectedField.render === "link"; 
  }

  isStandard(colKey, colData, dataFields){
    return !this.isCheck(colKey,colData, dataFields) && !this.isLink(colKey,colData, dataFields);

  }


  renderData(colKey, colData, dataFields) {
    let catalogs = this.dictionaryService.pageCatalogs;
    let selectedCatalog;
    let catalogOptions = []
    let selectedField = dataFields.find(field => field['DTO'] === colKey);
    // si es de tipo 
    if (!!selectedField.catalog && catalogs.length !== 0) {
      selectedCatalog = catalogs.find(
        catalog => selectedField.catalog === catalog.name
          // && catalog.name === selectedField.catalog
      )
      catalogOptions = selectedCatalog.options;
      let valor_a_meter = catalogOptions.find(
        rowCatalog => rowCatalog['valor'] === colData);
      
      return valor_a_meter['nombre'];
      } else if (!!selectedField.render) {
        switch (selectedField.render) {
          case "date":
            return this.datePipe.transform(new Date(colData).toDateString(), this.accountService.getDateFormat());
            break;
          case "coin":
            return colData + " €";
            break;
          case "formatNumber":
          return this.decimalPipe.transform(colData, "1.0-6", this.accountService.getNumericFormat()) ;
          break;
          default:
            return colData;
            break;
        }
    } else {
      return colData;
    }
   

  }

  alignement(colKey, dataFields) {
    let selectedCatalog;
    let selectedField = dataFields.find(field => field['DTO'] === colKey);
    if (!!selectedField.render && selectedField.render === "formatNumber" || selectedField.render === "coin") return "right";
    else return "left";
  }


}
