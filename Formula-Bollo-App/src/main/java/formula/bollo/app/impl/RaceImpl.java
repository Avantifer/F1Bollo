package formula.bollo.app.impl;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Race;
import formula.bollo.app.mapper.CircuitMapper;
import formula.bollo.app.mapper.RaceMapper;
import formula.bollo.app.model.RaceDTO;

@Component
public class RaceImpl implements RaceMapper{

    @Autowired
    private CircuitMapper circuitMapper;

    /**
     * Map RaceDTO to return an object type Race
     * @param raceDTO
     * @return class Race with RaceDTO properties
    */
    public Race raceDTOToRace(RaceDTO raceDTO) {
        Race race = new Race();
        BeanUtils.copyProperties(raceDTO, race);
        race.setCircuit(circuitMapper.circuitDTOToCircuit(raceDTO.getCircuit()));

        LocalDateTime localDateTime = raceDTO.getDateStart();
        Date dateStart = Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
        race.setDateStart(dateStart);
        return race;
    }

    /**
     * Map RaceDTO to return an object type Race
     * @param raceDTO
     * @return class Race with RaceDTO properties
    */
    public RaceDTO raceToRaceDTO(Race race) {
        RaceDTO raceDTO = new RaceDTO();
        BeanUtils.copyProperties(race, raceDTO);
        raceDTO.setCircuit(circuitMapper.circuitToCircuitDTO(race.getCircuit()));

        Instant instant = race.getDateStart().toInstant();
        ZoneId zoneId = ZoneId.systemDefault();
        LocalDateTime localDateTime = instant.atZone(zoneId).toLocalDateTime();
        raceDTO.setDateStart(localDateTime);        
        return raceDTO;
    }
    
}
