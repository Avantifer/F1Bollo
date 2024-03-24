package formula.bollo.app.services;

import org.springframework.stereotype.Service;

import formula.bollo.app.entity.Race;
import formula.bollo.app.entity.Sprint;
import formula.bollo.app.entity.SprintPosition;
import formula.bollo.app.mapper.SprintMapper;
import formula.bollo.app.model.SprintDTO;
import formula.bollo.app.repository.RaceRepository;
import formula.bollo.app.repository.SprintPositionRepository;
import formula.bollo.app.repository.SprintRepository;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Service
public class SprintService {
    
    private SprintRepository sprintRepository;
    private RaceRepository raceRepository;
    private SprintMapper sprintMapper;
    private SprintPositionRepository sprintPositionRepository;

    public SprintService(
        SprintRepository sprintRepository,
        RaceRepository raceRepository,
        SprintMapper sprintMapper,
        SprintPositionRepository sprintPositionRepository
    ) {
        this.sprintRepository = sprintRepository;
        this.raceRepository = raceRepository;
        this.sprintMapper = sprintMapper;
        this.sprintPositionRepository = sprintPositionRepository;
    }
    
    /**
     * Orders a list of SprintDTO objects by their positions (if available).
     *
     * @param sprintDTOs The list of SprintDTO objects to be ordered.
    */
    public void orderSprintsByPoints(List<SprintDTO> sprintDTOs) {
        Comparator<SprintDTO> pointsComparator = Comparator
        .comparing(sprint -> sprint.getPosition() != null ? sprint.getPosition().getPositionNumber() : null,
               Comparator.nullsLast(Integer::compareTo));
        Collections.sort(sprintDTOs, pointsComparator);
    }

    /**
     * Saves a list of SprintDTO objects to the repository.
     *
     * @param sprintDTOs The list of SprintDTO objects to be saved.
    */
    public void saveSprints(List<SprintDTO> sprintDTOs, int numberSeason) {
        Race race = raceRepository.findByCircuitId(sprintDTOs.get(0).getRace().getCircuit().getId(), numberSeason).get(0);

        sprintDTOs.stream().forEach((SprintDTO sprintDTO) -> {
            List<Sprint> existingSprint = sprintRepository.findByRaceId(sprintDTO.getRace().getId());
            Sprint sprintToUpdate = sprintMapper.sprintDTOToSprint(sprintDTO);

            if (existingSprint.isEmpty()) {
                sprintToUpdate.setRace(race);
            }

            if (sprintDTO.getPosition() != null) {
                SprintPosition position = sprintPositionRepository.findByPositionNumber(sprintDTO.getPosition().getPositionNumber()).get(0);
                sprintToUpdate.setPosition(position);
            }

            sprintRepository.save(sprintToUpdate);
        });
    }
}
