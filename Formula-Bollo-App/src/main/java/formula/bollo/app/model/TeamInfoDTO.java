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
public class TeamInfoDTO {
    TeamDTO team;
    int poles;
    int fastlaps;
    int racesFinished;
    int totalPoints;
    int championships;
    int constructors;
    int penalties;
    int bestPosition;
    int victories;
    int podiums;
}

