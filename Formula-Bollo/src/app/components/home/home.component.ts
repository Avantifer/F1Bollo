import { Component } from '@angular/core';
import { Configuration } from 'src/shared/models/configuration';
import { DriverPoints } from 'src/shared/models/driverPoints';
import { Team } from 'src/shared/models/team';
import { ConfigurationService } from 'src/shared/services/configuration.service';
import { ResultService } from 'src/shared/services/result.service';
import { TeamService } from 'src/shared/services/team.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  teams: Team[] = [];
  configurations: Configuration[] = [];
  driverPoints: DriverPoints[] = [];
  top3: DriverPoints[] = [];

  constructor(private teamService: TeamService, private configurationService: ConfigurationService, private resultService: ResultService) { }

  ngOnInit(): void {
    this.obtainAllTeams();
    this.obtainAllConfigurations();
    this.obtainAllPointsDriver();
  }


  /**
   * Get all teams from Backend.
   * @memberof HomeComponent
  */
  obtainAllTeams(): void {
    this.teamService.getAllTeams().subscribe((teams: Team[]) =>{
      this.teams = teams;
    });
  }

  /**
   * Get all configurations from Backend.
   * @memberof HomeComponent
  */
  obtainAllConfigurations(): void {
    this.configurationService.getAllConfigurations().subscribe((configurations: Configuration[]) => {
      this.configurations = configurations;
    });
  }

  /**
   * Get all points of drivers from Backend.
   * @memberof HomeComponent
  */
  obtainAllPointsDriver(): void {
    this.resultService.getAllDriverPoints(10).subscribe((driverPoints: DriverPoints[]) => {
      this.driverPoints = driverPoints;
      this.top3 = driverPoints.slice(0, 3);
      [this.top3[0], this.top3[1]] = [this.top3[1], this.top3[0]];
    });
  }
}
