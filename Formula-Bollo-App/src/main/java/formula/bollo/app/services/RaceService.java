package formula.bollo.app.services;

import java.util.List;

import org.springframework.stereotype.Service;

import formula.bollo.app.entity.Race;
import formula.bollo.app.mapper.RaceMapper;
import formula.bollo.app.model.RaceDTO;
import formula.bollo.app.repository.RaceRepository;

@Service
public class RaceService {
    
    private final RaceMapper raceMapper;

    private final RaceRepository raceRepository;

    public RaceService(RaceMapper raceMapper, RaceRepository raceRepository) {
        this.raceMapper = raceMapper;
        this.raceRepository = raceRepository;
    }

    /**
     * Saves or updates a race based on the provided RaceDTO.
     *
     * @param raceDTO The RaceDTO containing race information to be saved or updated.
    */
    public void saveRace(RaceDTO raceDTO, int numberSeason) {
        List<Race> existingRace = raceRepository.findByCircuitId(raceDTO.getCircuit().getId(), numberSeason);
        Race race = new Race();

        if (existingRace.isEmpty()) {
            race = raceMapper.raceDTOToRace(raceDTO);
            raceRepository.save(race);            
        } else {
            race = raceMapper.raceDTOToRace(raceDTO);
            race.setId(existingRace.get(0).getId());
        }

        raceRepository.save(race);
    }
}
