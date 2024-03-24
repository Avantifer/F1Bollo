package formula.bollo.app.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Sprint;
import formula.bollo.app.mapper.DriverMapper;
import formula.bollo.app.mapper.RaceMapper;
import formula.bollo.app.mapper.SeasonMapper;
import formula.bollo.app.mapper.SprintMapper;
import formula.bollo.app.mapper.SprintPositionMapper;
import formula.bollo.app.model.SprintDTO;

@Component
public class SprintImpl implements SprintMapper {
    
    private DriverMapper driverMapper;
    private RaceMapper raceMapper;
    private SprintPositionMapper sprintPositionMapper;
    private SeasonMapper seasonMapper;

    public SprintImpl(
        DriverMapper driverMapper,
        RaceMapper raceMapper,
        SprintPositionMapper sprintPositionMapper,
        SeasonMapper seasonMapper
    ) { 
        this.driverMapper = driverMapper;
        this.raceMapper = raceMapper;
        this.sprintPositionMapper = sprintPositionMapper;
        this.seasonMapper = seasonMapper;
    }
    
    /**
     * Converts a SprintDTO object to a Sprint object.
     *
     * @param sprintDTO The SprintDTO object to be converted.
     * @return        A Sprint object with properties copied from the SprintDTO.
    */
    @Override
    public Sprint sprintDTOToSprint(SprintDTO sprintDTO) {
        Sprint sprint = new Sprint();
        BeanUtils.copyProperties(sprintDTO, sprint);
        sprint.setDriver(driverMapper.driverDTOToDriver(sprintDTO.getDriver()));
        sprint.setRace(raceMapper.raceDTOToRace(sprintDTO.getRace()));
        sprint.setSeason(seasonMapper.seasonDTOToSeason(sprintDTO.getSeason()));

        if (sprintDTO.getPosition() != null) {
            sprint.setPosition(sprintPositionMapper.sprintPositionDTOToSprintPosition(sprintDTO.getPosition()));
        }

        return sprint;
    }

    /**
     * Converts a Sprint object to a SprintDTO object.
     *
     * @param sprint The Sprint object to be converted.
     * @return     A SprintDTO object with properties copied from the Sprint.
    */
    @Override
    public SprintDTO sprintToSprintDTO(Sprint sprint) {
        SprintDTO sprintDTO = new SprintDTO();
        BeanUtils.copyProperties(sprint, sprintDTO);
        sprintDTO.setDriver(driverMapper.driverToDriverDTO(sprint.getDriver()));
        sprintDTO.setRace(raceMapper.raceToRaceDTO(sprint.getRace()));
        sprintDTO.setSeason(seasonMapper.seasonToSeasonDTO(sprint.getSeason()));

        if (sprint.getPosition() != null) {
            sprintDTO.setPosition(sprintPositionMapper.sprintPositionToSprintPositionDTO(sprint.getPosition()));
        }
        
        return sprintDTO;
    }

    /**
     * Converts a list of Sprint objects to a list of SprintDTO objects.
     *
     * @param sprints The list of Sprint objects to be converted.
     * @return      A list of SprintDTO objects with properties copied from the Sprints.
    */
    @Override
    public List<SprintDTO> convertSprintsToSprintsDTO(List<Sprint> sprints) {
        return sprints.parallelStream()
                .map(this::sprintToSprintDTO)
                .collect(Collectors.toList());
    }
}
