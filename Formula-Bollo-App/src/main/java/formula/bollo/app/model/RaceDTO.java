package formula.bollo.app.model;

import java.time.LocalDateTime;

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
public class RaceDTO {
    private Long id;
    private CircuitDTO circuit;
    private LocalDateTime dateStart;
    private SeasonDTO season;
    private int finished;
}
