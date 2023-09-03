package formula.bollo.app.model;

import java.util.List;

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
public class DriverPenaltiesDTO {
    private DriverDTO driver;
    private List<RacePenaltiesDTO> racePenalties;
}
