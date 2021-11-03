import { AfterViewChecked, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as mockData from 'src/assets/test/mockData'
import { Payments, Collections } from 'src/assets/test/mockInterfaces'
import * as INTERFACES from 'src/app/core/models/other-interfaces';
import * as constants from 'src/app/core/config/const';
import { Observable, Subscription } from 'rxjs';
import { DataTransfer, CatalogData } from 'src/app/core/models/other-interfaces';
import { DataTransferService } from 'src/app/core/services/data-transfer.service';
import { SearchFormsNgComponent } from '../search-formsNg/search-formsNg.component';





@Component({
    selector: 'sica-dragDrop',
    templateUrl: './dragDrop.component.html',
    styleUrls: ['./dragDrop.component.scss']
})
export class DragDropComponent implements OnInit, AfterViewChecked {
    @Input() jsonDataPayments: INTERFACES.jsonViewData;
    @Input() jsonDataCollections: INTERFACES.jsonViewData;
    payments: Payments[];
    selectedPayments: Payments[] = [];
    draggedPayment: Payments;
    collections: Collections[];
    selectedCollections: Collections[] = [];
    draggedCollection: Collections;
    filterParamPayments: any;
    filterParamCollections: any;
    side: string = "";
    subsPaymentTransfer$: Subscription = new Subscription();
    subsCollectionTransfer$: Subscription = new Subscription();
    dataPaymentTransfer$: Observable<DataTransfer[]>;
    dataCollectionTransfer$: Observable<DataTransfer[]>;
    activeState: boolean[] = [true];
    dataCollectionChip: string[] = [];
    dataPaymentChip: string[] = [];
    @ViewChild("searchCollectionModule", { static: false }) searchCollectionCpt: SearchFormsNgComponent;
    @ViewChild("searchPaymentModule", { static: false }) searchPaymentCpt: SearchFormsNgComponent;
    calledOnce: boolean = false;
    paymentAmount: number = 0;
    collectionAmount: number = 0;
    differenceAmount: number = 0;
    globalPayments: Payments[];
    globalCollections: Collections[];


    constructor(
        private dataTransferService: DataTransferService
    ) {
        this.dataPaymentTransfer$ = this.dataTransferService.matchFilterPaymentTransfer();
        this.dataCollectionTransfer$ = this.dataTransferService.matchFilterCollectionTransfer();
        this.subsPaymentTransfer$ = this.dataPaymentTransfer$.subscribe((data: DataTransfer[]) => {
            this.filterParamPayments = [];
            this.dataPaymentChip = [];
            data.forEach(rowData => {
                if (rowData.value != null && ((typeof (rowData.value) === "string" && rowData.value !== "") || (typeof (rowData.value) !== "string" && rowData.value?.length !== 0))) {
                    this.filterParamPayments[rowData.key] = rowData.value;
                    this.dataPaymentChip.push(rowData.key + " : " + rowData.value);
                }
            });
            this.filterPayments()
        });
        this.subsCollectionTransfer$ = this.dataCollectionTransfer$.subscribe((data: DataTransfer[]) => {
            this.filterParamCollections = [];
            this.dataCollectionChip = [];
            data.forEach(rowData => {
                if (rowData.value != null
                    && ((typeof (rowData.value) === "string"
                        && rowData.value !== "")
                        || (typeof (rowData.value) !== "string" && rowData.value?.length !== 0))) {
                    this.filterParamCollections[rowData.key] = rowData.value;
                    this.dataCollectionChip.push(rowData.key + " : " + rowData.value)
                }
            });
            this.filterCollections();
        });


    }

    ngOnInit() {

        this.inicializeData();

        this.filterData();


    }

    inicializeData(): void {
        this.selectedPayments = [];
        this.selectedCollections = [];
        this.globalPayments = this.payments = mockData.payments;
        this.globalCollections = this.collections = mockData.collections;
    }

    dragEnd(event) {
        this.draggedPayment = null;
        this.draggedCollection = null;
    }

    dragStartPayment(event, product: Payments) {
        this.side = 'payments';
        this.draggedPayment = product;
    }
    dragStartCollection(event, product: Collections) {
        this.side = 'collections';
        this.draggedCollection = product;
    }

    dropPayments(event) {
        if (this.draggedPayment) {
            let draggedPaymentIndex = this.findIndex(this.draggedPayment, this.side);
            this.selectedPayments = [...this.selectedPayments, this.draggedPayment];
            this.payments = this.payments.filter((val, i) => i != draggedPaymentIndex);
            this.globalPayments = this.globalPayments.filter((val, i) => i != draggedPaymentIndex);
            this.paymentAmount = this.selectedPayments.reduce((a, b) => a + b.amount, 0);
            this.differenceAmount = this.paymentAmount - this.collectionAmount;
            this.draggedPayment = null;
        }
        this.side = "";
    }

    dropCollections(event) {
        if (this.draggedCollection) {
            let draggedCollectionIndex = this.findIndex(this.draggedCollection, this.side);
            this.selectedCollections = [...this.selectedCollections, this.draggedCollection];
            this.collections = this.collections.filter((val, i) => i != draggedCollectionIndex);
            this.globalCollections = this.globalCollections.filter((val, i) => i != draggedCollectionIndex);
            this.collectionAmount = this.selectedCollections.reduce((a, b) => a + b.amount, 0);
            this.differenceAmount = this.paymentAmount - this.collectionAmount;
            this.draggedCollection = null;
        }
        this.side = "";
    }



    findIndex(data, side) {
        let index = -1;
        switch (side) {
            case 'payments':
                for (let i = 0; i < this.payments.length; i++) {
                    if (data.id === this.payments[i].id) {
                        index = i;
                        break;
                    }
                }
                break;

            default:
                for (let i = 0; i < this.collections.length; i++) {
                    if (data.id === this.collections[i].id) {
                        index = i;
                        break;
                    }
                }
                break;
        }

        return index;
    }

    toggle(index: number) {
        this.activeState[index] = !this.activeState[index];
    }

    removeChipFilter(event, opt) {
        let [controlKey, controlValue] = event.value.split(":");
        let convertedFormValues: INTERFACES.DataTransfer[] = [];
        switch (opt) {
            case 'collection':
                controlKey = controlKey.trim();
                controlValue = controlValue.trim();
                this.searchCollectionCpt.searchGlobalForm.controls[controlKey].setValue("");

                // ... pasa los valores limpios a la caché
                this.dataTransferService.setDataTransferinSessionStorage(this.searchCollectionCpt.cachedFiltersLabel, this.searchCollectionCpt.searchGlobalForm.value);

                convertedFormValues = this.searchCollectionCpt.convertDataToInterface(this.searchCollectionCpt.searchGlobalForm.value);

                // ... y envía esos valores para que filtren desde el inicio
                this.searchCollectionCpt.dataTransferService.setFilterCollectionTransfer(convertedFormValues);
                break;

            default:
                [controlKey, controlValue] = event.value.split(":")
                controlKey = controlKey.trim();
                controlValue = controlValue.trim();
                this.searchPaymentCpt.searchGlobalForm.controls[controlKey].setValue("");

                // ... pasa los valores limpios a la caché
                this.dataTransferService.setDataTransferinSessionStorage(this.searchPaymentCpt.cachedFiltersLabel, this.searchPaymentCpt.searchGlobalForm.value);

                convertedFormValues = this.searchPaymentCpt.convertDataToInterface(this.searchPaymentCpt.searchGlobalForm.value);

                // ... y envía esos valores para que filtren desde el inicio
                this.searchPaymentCpt.dataTransferService.setFilterPaymentTransfer(convertedFormValues);
                break;
        }


    }

    inicializeDraggedDroppedData() {
        this.globalPayments = this.globalPayments.concat(...this.selectedPayments);
        this.globalCollections = this.globalCollections.concat(...this.selectedCollections);
        this.globalPayments.sort((a, b) => a.id > b.id ? 1 : -1);
        this.globalCollections.sort((a, b) => a.id > b.id ? 1 : -1);

        this.selectedPayments = this.selectedCollections = [];
        this.paymentAmount = this.collectionAmount = this.differenceAmount = 0;
    }

    validateConciliation() {
        switch (this.differenceAmount >= 0) {
            case true:
                if (this.differenceAmount !== 0) {
                    let originalPayments: Payments[] = mockData.payments;
                    let newPayment: Payments = {
                        id: (this.getLastId(originalPayments)) + 1,
                        nif: "2",
                        docNumber: -1,
                        amount: this.differenceAmount,
                        paymentCode: 'aux-code',
                        state: "2"
                    }
                    this.globalPayments.push(newPayment);
                }


                this.selectedPayments.map(
                    (selectedPayment) => {
                        selectedPayment.state = "1"
                        this.globalPayments.push(selectedPayment);
                    })
                break;

            default:
                let newCollection: Collections = {
                    id: (this.getLastId(this.globalCollections)) + 1,
                    nif: "-111111111Z",
                    concept: "aux",
                    amount: (this.differenceAmount) * (-1),
                    collectionCode: "2"
                }
                this.globalCollections.push(newCollection);
                this.selectedPayments.map(
                    (selectedPayment) => {
                        selectedPayment.state = "1"
                        this.globalPayments.push(selectedPayment);
                    })

                break;
        }
        this.selectedPayments = this.selectedCollections = [];
        this.inicializeDraggedDroppedData();
        this.filterData();
    }

    getLastId(data) {
        return data.reduce((a, b) => a.id > b.id ? a.id : b.id);
    }

    filterData() {
        this.filterPayments();
        this.filterCollections();
    }

    filterPayments() {
        this.payments = this.globalPayments;
        let selectedCriteria: string;
        for (let filter in this.filterParamPayments) {
            selectedCriteria = this.jsonDataPayments.area.find(area => area.id === filter)['criteria'];
            switch (selectedCriteria) {
                case 'equal':
                    this.payments = this.globalPayments.filter(globalPayment => {
                        return globalPayment[filter] == (this.filterParamPayments[filter]);
                    })
                    break;
                case 'include':
                    this.payments = this.globalPayments.filter(globalPayment =>
                        globalPayment[filter].includes(this.filterParamPayments[filter]));

                    break;

                case 'range':
                    this.payments = this.globalPayments.filter(globalPayment =>
                        globalPayment[filter] > (this.filterParamPayments[filter][0]) &&
                        globalPayment[filter] < (this.filterParamPayments[filter][1])
                    )
                    break;
            }

        }


    }

    filterCollections() {
        this.collections = this.globalCollections;
        let selectedCriteria: string;
        for (let filter in this.filterParamCollections) {
            selectedCriteria = this.jsonDataCollections.area.find(area => area.id === filter)['criteria'];
            switch (selectedCriteria) {
                case 'equal':
                    this.collections = this.globalCollections.filter(globalCollection =>
                        globalCollection[filter] === (this.filterParamCollections[filter]));
                    break;
                case 'include':
                    this.collections = this.globalCollections.filter(globalCollection =>
                        globalCollection[filter].includes(this.filterParamCollections[filter]));

                    break;

                case 'range':
                    this.collections = this.globalCollections.filter(globalCollection =>
                        globalCollection[filter] > (this.filterParamCollections[filter][0]) &&
                        globalCollection[filter] < (this.filterParamCollections[filter][1])
                    )
                    break;
            }

        }


    }

    isPaid(state) {
        return state === '1'
    }

    get isNegativeValue() {
        return this.collectionAmount > this.paymentAmount;
    }

    get notDraggedAndDropped() {
        return this.selectedPayments.length === 0 || this.selectedCollections.length === 0;
    }

    ngAfterViewChecked() {
        if (!this.calledOnce) {
            this.calledOnce = true;
            this.searchPaymentCpt.cachedfilters();
            this.searchCollectionCpt.cachedfilters();
        }
    }

}
