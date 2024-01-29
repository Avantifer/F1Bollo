import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FantasyDialogTeamComponent } from 'src/app/components/fantasy/fantasy-dialog-team/fantasy-dialog-team.component';
import { FantasyElection } from 'src/shared/models/fantasyElection';

@Component({
  selector: 'app-formula-table',
  templateUrl: './formula-table.component.html',
  styleUrls: ['./formula-table.component.scss']
})
export class FormulaTableComponent {
  @Input() data: any[] = [];
  @Input() displayedColumns: string[] = [];

  constructor(public dialog: MatDialog) { }

  /**
   * Opens a dialog for fantasy election teams.
   *
   * @param enterAnimationDuration - The duration of the enter animation for the dialog.
   * @param exitAnimationDuration - The duration of the exit animation for the dialog.
   * @param fantasyElection - The fantasy election data to be passed to the dialog.
  */
  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, fantasyElection: FantasyElection): void {
    this.dialog.open(FantasyDialogTeamComponent, {
      data: {fantasyElection: fantasyElection},
      width: '500px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}
