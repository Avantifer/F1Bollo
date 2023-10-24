import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-formula-table',
  templateUrl: './formula-table.component.html',
  styleUrls: ['./formula-table.component.scss']
})
export class FormulaTableComponent {
  @Input() data: any[] = [];
  @Input() displayedColumns: string[] = [];
}
