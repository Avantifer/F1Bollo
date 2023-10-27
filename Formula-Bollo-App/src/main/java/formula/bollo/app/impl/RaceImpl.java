package formula.bollo.app.impl;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Race;
import formula.bollo.app.mapper.CircuitMapper;
import formula.bollo.app.mapper.RaceMapper;
import formula.bollo.app.mapper.SeasonMapper;
import formula.bollo.app.model.RaceDTO;

@Component
public class RaceImpl implements RaceMapper{

    @Autowired
    private CircuitMapper circuitMapper;

    @Autowired
    private SeasonMapper seasonMapper;

    /**
     * Converts a RaceDTO object to a Race object.
     *
     * @param raceDTO The RaceDTO object to be converted.
     * @return        A Race object with properties copied from the RaceDTO.
    */
    public Race raceDTOToRace(RaceDTO raceDTO) {
        Race race = new Race();
        BeanUtils.copyProperties(raceDTO, race);
        race.setCircuit(circuitMapper.circuitDTOToCircuit(raceDTO.getCircuit()));

        LocalDateTime localDateTime = raceDTO.getDateStart();
        Date dateStart = Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
        race.setDateStart(dateStart);
        race.setSeason(this.seasonMapper.seasonDTOToSeason(raceDTO.getSeason()));
        
        return race;
    }

    /**
     * Converts a Race object to a RaceDTO object.
     *
     * @param race The Race object to be converted.
     * @return     A RaceDTO object with properties copied from the Race.
    */
    public RaceDTO raceToRaceDTO(Race race) {
        RaceDTO raceDTO = new RaceDTO();
        BeanUtils.copyProperties(race, raceDTO);
        raceDTO.setCircuit(circuitMapper.circuitToCircuitDTO(race.getCircuit()));

        Instant instant = race.getDateStart().toInstant();
        ZoneId zoneId = ZoneId.systemDefault();
        LocalDateTime localDateTime = instant.atZone(zoneId).toLocalDateTime();
        raceDTO.setDateStart(localDateTime);
        raceDTO.setSeason(this.seasonMapper.seasonToSeasonDTO(race.getSeason())); 

        return raceDTO;
    }

    /**
     * Converts a list of Race objects to a list of RaceDTO objects.
     *
     * @param races The list of Race objects to be converted.
     * @return      A list of RaceDTO objects with properties copied from the Races.
    */
    @Override
    public List<RaceDTO> convertRacesToRacesDTO(List<Race> races) {
        return races.parallelStream()
                .map(this::raceToRaceDTO)
                .collect(Collectors.toList());
    }
}
