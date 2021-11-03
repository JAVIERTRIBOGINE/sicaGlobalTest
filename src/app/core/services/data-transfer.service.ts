import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DataTransfer } from 'src/app/core/models/other-interfaces';
@Injectable({
  providedIn: 'root'
})

/**
 * This service is used to send data by observables
 * This data is created by a form, whis is configured by a object readen in a json file
 */
export class DataTransferService {
  currentFilterLabel: string;
  filterSubject: Subject<DataTransfer[]> = new Subject<DataTransfer[]>();
  filterCollectionSubject: Subject<DataTransfer[]> = new Subject<DataTransfer[]>();
  filterPaymentSubject: Subject<DataTransfer[]> = new Subject<DataTransfer[]>();
  idConcession: number;

  //matches


  matchFilterTransfer():Observable<DataTransfer[]> {
    return this.filterSubject.asObservable();
  }
  matchFilterPaymentTransfer():Observable<DataTransfer[]> {
    return this.filterPaymentSubject.asObservable();
  }
  matchFilterCollectionTransfer():Observable<DataTransfer[]> {
    return this.filterCollectionSubject.asObservable();
  }

  setFilterTransfer(data): void {
    this.filterSubject.next(data);
  }
  setFilterCollectionTransfer(data): void {
    this.filterCollectionSubject.next(data);
  }
  setFilterPaymentTransfer(data): void {
    this.filterPaymentSubject.next(data);
  }

  setIdConcession(idConcession):void {
    this.idConcession = idConcession;
  }

  public getIdConcession(): number {
    return this.idConcession;
  }

  setDataTransferinSessionStorage(label, data): void {
    this.setCurrentFilterLabel(label);
    sessionStorage.setItem(label, JSON.stringify(data));
  }

  getDataTransferinSessionStorage(label): object {
    return JSON.parse(sessionStorage.getItem(label));
  }

  setCurrentFilterLabel(label): void {
    this.currentFilterLabel = label;
  }

  getCurrentFilterLabel(): string {
    return this.currentFilterLabel;
  }

}
