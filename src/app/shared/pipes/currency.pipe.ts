import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arscurrency',
  standalone: true
})
export class ArsCurrencyPipe implements PipeTransform {

  transform(value: number): string {
    return value.toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    });
  }

}
