import { Component } from '@angular/core';
import { TeamWithDrivers } from 'src/shared/models/teamWithDrivers';
import { TeamService } from 'src/shared/services/team.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent {

  teamWithDrivers: TeamWithDrivers[] = [];

  constructor(private teamService: TeamService) { }

  ngOnInit(): void {
    this.teamService.getAllTeamsWithDrivers().subscribe((teamWithDrivers: TeamWithDrivers[]) => {
      this.teamWithDrivers = teamWithDrivers;
    });
  }
}
