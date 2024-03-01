import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "isNanPipe",
})
export class IsNanPipe implements PipeTransform {
  transform(value: number): boolean {
    let isNan: boolean = true;

    if (Number.isNaN(value)) isNan = false;

    return isNan;
  }
}
