import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pricePipe'
})
export class PricePipe implements PipeTransform {

  transform(value: number): string {
    let price: string = value.toString();
    let groups: string[] = price.split(/(?=(?:...)*$)/);
    return groups.join(".");
  }
}
