package formula.bollo.app.model;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class FantasyElectionDTO {
    private Long id;
    private UserDTO user;
    private DriverDTO driverOne;
    private DriverDTO driverTwo;
    private DriverDTO driverThree;
    private TeamDTO team;
    private RaceDTO race;
    private SeasonDTO season;
}

