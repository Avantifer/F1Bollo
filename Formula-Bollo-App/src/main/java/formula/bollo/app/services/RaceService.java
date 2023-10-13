package formula.bollo.app.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import formula.bollo.app.entity.Race;
import formula.bollo.app.mapper.RaceMapper;
import formula.bollo.app.model.RaceDTO;
import formula.bollo.app.repository.RaceRepository;

@Service
public class RaceService {
    
    @Autowired
    private RaceMapper raceMapper;

    @Autowired
    private RaceRepository raceRepository;

    /**
     * Saves or updates a race based on the provided RaceDTO.
     *
     * @param raceDTO The RaceDTO containing race information to be saved or updated.
    */
    public void saveRace(RaceDTO raceDTO) {
        List<Race> existingRace = raceRepository.findByCircuitId(raceDTO.getCircuit().getId());
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
