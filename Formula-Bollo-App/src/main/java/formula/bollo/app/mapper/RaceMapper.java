package formula.bollo.app.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Race;
import formula.bollo.app.model.RaceDTO;

@Component
public interface RaceMapper {
    Race raceDTOToRace(RaceDTO raceDTO);

    RaceDTO raceToRaceDTO(Race race);

    List<RaceDTO> convertRacesToRacesDTO(List<Race> races);
}
