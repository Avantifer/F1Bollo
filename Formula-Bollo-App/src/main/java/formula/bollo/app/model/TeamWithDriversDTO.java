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
public class TeamWithDriversDTO {
    private TeamDTO teamDTO;
    private DriverDTO driver1;
    private DriverDTO driver2;
    private Integer totalPoints;
}
