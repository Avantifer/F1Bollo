import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "pricePipe",
})
export class PricePipe implements PipeTransform {
  transform(value: number): string {
    let price: string = value.toString();
    let isNegative: boolean = false;

    if (price.startsWith("-")) {
      price = price.split("-")[1];
      isNegative = true;
    }

    const groups: string[] = price.split(/(?=(?:...)*$)/);
    return isNegative ? "-" + groups.join(".") : groups.join(".");
  }
}
