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
public class SprintDTO {
    private Long id;
    private RaceDTO race;
    private DriverDTO driver;
    private SprintPositionDTO position;
    private int fastlap;
    private SeasonDTO season;
}
