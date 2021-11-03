import { ControlValueAccessor } from '@angular/forms';

/**
 * calse que implementa los métodos obligatorios para poder manejar
 * ... los componentes del formulario de manera reactiva
 */
export abstract class BaseCVA implements ControlValueAccessor  {

    value: string;
    onChange = (_: any) => {};

    constructor() { }

    writeValue(inputValue: any): void { 
        
    }

    //se registra la función 'onchange' como seleccionada para manejar los
    // ... datos del elemento del formulario de manera reactiva, 
    // ... cuando haya un cambio del this.value
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    //se registra la función 'onchange' como seleccionada para manejar los
    // ... datos (this.value) del elemento del formulario de manera reactiva, 
    // ... cuando se lance el evento 'onTouch'
    registerOnTouched(fn: any): void { }
    setDisabledState(isDisabled: boolean): void { }
}
