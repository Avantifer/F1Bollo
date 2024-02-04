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
public class FantasyPriceTeamDTO {
    private Long id;
    private TeamDTO team;
    private RaceDTO race;
    private int price;
    private SeasonDTO season;
}
