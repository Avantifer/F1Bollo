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

    const groups: string[] = [];
    for (let i = price.length; i > 0; i -= 3) {
      groups.unshift(price.slice(Math.max(0, i - 3), i));
    }

    return isNegative ? "-" + groups.join(".") : groups.join(".");
  }
}
