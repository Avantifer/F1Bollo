package formula.bollo.app.mapper;

import java.util.List;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Race;
import formula.bollo.app.model.RaceDTO;

@Component
public interface RaceMapper {
    
    RaceMapper INSTANCE = Mappers.getMapper(RaceMapper.class);

    Race raceDTOToRace(RaceDTO raceDTO);

    RaceDTO raceToRaceDTO(Race race);

    List<RaceDTO> convertRacesToRacesDTO(List<Race> races);
}
