import * as FileSaver from "file-saver";
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { MenuItem } from "primeng/api";
import * as constants from 'src/app/core/config/const';
import * as INTERFACES from 'src/app/core/models/other-interfaces'


export function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

export function delay(callback, ms) {
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      callback.apply(context, args);
    }, ms || 0);
  };
}


export function exportExcel(data, name) {
  import("Xlsx").then(xlsx => {
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAsExcelFile(excelBuffer, name);
  });
}

function saveAsExcelFile(buffer: any, fileName: string): void {
  let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  let EXCEL_EXTENSION = '.xlsx';
  const data: Blob = new Blob([buffer], {
    type: EXCEL_TYPE
  });
  FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
}

export function exportPdf(data, columns, name) {
  let doc = new jsPDF();
  let pdfCols = [[...columns.map(col => col.header)]];
  let rows = [[]];
  data.forEach((element, i) => {
    rows[i] = [];
    for (let key in element) {
      let temp = [element[key]];
      rows[i].push(temp);
    }
  });

  autoTable(doc,
    {
      head: pdfCols,
      body: rows
    }
  );
  doc.save(name + '.pdf');
}

export function getSubmenuMockData(idConcession, idUser): MenuItem[] {
  return [
    {
      label: "Administración",
      items: [
        {
          label: "Roles",
          routerLink: "/concession/"+ idConcession + "/rols"
        },
        {
          label: "Concesiones",
          items: [
            {
              label: "Edición",
              routerLink: "/concession/" + idConcession + "/" + constants.ROUTING_REFERENCES.AJUSTES_CONCESION
            }
          ]
        },
        {
          label: "Zonas",
          routerLink: "/concession/" + idConcession + "/zonas"
        },
        {
          label: "Usuarios",
          routerLink: "/concession/" + idConcession + "/usuarios"
        }
      ]
    }
  ]
}

export function changeDateToIso(jsonData, values){
 jsonData.forEach(element => {
   element['subArea'].forEach(subElement => {
     if ( subElement.tag === "calendar") values[subElement.id] = new Date(values[subElement.id]).toISOString();
   });
 });  
 
  return values;
}

export function changeIsoToDate(value){
   
 return new Date(value);
}

export function convertSearchArea(arrayApiObjects, module) {
  let convertedSubArea: INTERFACES.iConvertSubAreaObject = {id:'', class:'', label: '', tag: '', type:'', placeholder: '', disabled: false};
  let convertedArea: INTERFACES.iConvertAreaObject = {title: '', class: '', subArea: []};
  let convertedObject: INTERFACES.iConvertObject = {title: '', section: '', class: '', area: [], buttons: {}};
  convertedArea.title = "",
  convertedArea.class = "",
  arrayApiObjects.maestro.forEach(apiObject => {
    convertedSubArea= {id:'', class:'', label: '', tag: '', type:'', placeholder: '', disabled: false};
    convertedSubArea.id = apiObject.id,
    convertedSubArea.class = apiObject.class,
    convertedSubArea.label = apiObject.label,
    convertedSubArea.tag = apiObject.tag
    convertedSubArea.type = apiObject.type
    convertedSubArea.placeholder = apiObject.placeholder,
    convertedSubArea.disabled = isDisabled(apiObject, module);
    convertedArea.subArea.push(convertedSubArea);
  });
  convertedObject.title = arrayApiObjects.nombreEntidad;
  convertedObject.section = "";
  convertedObject.class = arrayApiObjects.clase;
  
  convertedObject.area.push(convertedArea);
  convertedObject.buttons = {
    cancelButton: true,
    submitButton: !isView(module),
    editButton: isView(module)
  }
  return convertedObject;
}

function isDisabled(object, module) {
  let prop = object.id;
  return module === 'view' || prop === 'id'|| prop === 'maestro' || prop === 'orden' || prop === 'activo'
}

function isView(module) {
  return module === 'view';
}

function isCreate(module) {
  return module === 'create';
}
