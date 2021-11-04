import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api/menuitem';
import { forkJoin, Subscription } from 'rxjs';
import { JsonService } from 'src/app/core/services/json.service';
import { DictionaryService } from 'src/app/core/services/dictionary.service';
import * as INTERFACES from 'src/app/core/models/other-interfaces';
import * as constants from 'src/app/core/config/const';


@Component({
  selector: 'sica-payments-collections',
  templateUrl: './payments-collections.component.html',
  styleUrls: ['./payments-collections.component.scss'],
})
export class PaymentsCollectionsComponent implements OnInit {

  items: MenuItem[] = []
  subsJson$: Subscription = new Subscription();
  jsonDataPayments: INTERFACES.jsonViewData;
  jsonDataCollections: INTERFACES.jsonViewData;
  generalTitle: string;
  searchAreas: INTERFACES.searchAreas[];
  allLoaded: boolean = false;

  constructor(
    private router: Router,
    private jsonService: JsonService,
    public dictionaryService: DictionaryService
  ) {
  }

  public ngOnInit(): void {
    this.subsJson$.add(
      forkJoin([
        this.jsonService.readAllFile(
          constants.ROOT_JSON_CONFIG_DIR + constants.JSON_FILE_NAME.CONCILIATIONS + "/" + constants.JSON_FILE_NAME.PAYMENTS + ".json"),
        this.jsonService.readAllFile(
          constants.ROOT_JSON_CONFIG_DIR + constants.JSON_FILE_NAME.CONCILIATIONS + "/" + constants.JSON_FILE_NAME.COLLECTIONS + ".json"),
      ]).subscribe(
        ([dataPayments, dataCollections]) => {
          this.jsonDataPayments = dataPayments;
          this.jsonDataCollections = dataCollections;
          this.generalTitle = "Conciliaciones";

          // se cargan catalogos en la tabla y en el formulario de filtros, si hay
          this.dictionaryService.catalogsForSearch(this.jsonDataCollections.area);
          this.dictionaryService.catalogsForSearch(this.jsonDataPayments.area);
          this.allLoaded = true;
        })
    )
  }

  get paymentsAndCollectionsData() {
    return this.allLoaded;
  }

  goMontefrio() {
    this.router.navigate(['/home'])
  }

}
