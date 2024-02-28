import { Component, Input } from "@angular/core";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { FantasyDialogTeamComponent } from "src/app/components/fantasy/fantasy-dialog-team/fantasy-dialog-team.component";
import { FantasyElection } from "src/shared/models/fantasyElection";

@Component({
  selector: "app-formula-table",
  templateUrl: "./formula-table.component.html",
  styleUrls: ["./formula-table.component.scss"],
})
export class FormulaTableComponent {
  @Input() data: unknown[] = [];
  @Input() displayedColumns: string[] = [];

  ref: DynamicDialogRef | undefined;

  constructor(public dialogService: DialogService) { }

  /**
   * Opens a dialog for fantasy election teams.
  */
  openTeamDialog(fantasyElection : FantasyElection): void {
    this.ref = this.dialogService.open(FantasyDialogTeamComponent, {
      header: "Su equipo",
      data: {fantasyElection: fantasyElection},
      resizable: false,
      dismissableMask: true,
      width: "45rem",
      breakpoints: { "1199px": "94vw", "575px": "90vw" }
    });
  }
}
