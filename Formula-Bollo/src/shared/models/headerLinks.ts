export default class HeaderLinks {
  label: string;
  routerLink: string[];
  command: () => void;

  constructor(label: string, routerLink: string[], command: () => void) {
    this.label = label;
    this.routerLink = routerLink;
    this.command = command;
  }
}
