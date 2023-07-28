import { Component } from '@angular/core';
import { DriverPoints } from 'src/shared/models/driverPoints';
import { ResultService } from 'src/shared/services/result.service-api';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent {

  driverPoints: DriverPoints[] = [];

  constructor(private resultService: ResultService) {
    this.resultService = resultService;
  }

  ngOnInit(): void {
    this.obtainAllResults();
  }

  /**
   * Get all results of all drivers
   * @memberof DriversComponent
  */
  obtainAllResults(): void {
    this.resultService.getAllDriverPoints().subscribe((driverPoints: DriverPoints[]) => {
      this.driverPoints = driverPoints;
    });
  }
}
