package formula.bollo.app.services;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

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

    /**
     * Retrieves a list of all previous races and the next unfinished race for a given season.
     *
     * @param numberSeason The season for which races are to be retrieved.
     * @return List of RaceDTO objects representing all previous races and the next unfinished race.
    */
    public List<RaceDTO> getAllPreviousAndNextOne(int numberSeason) {
        List<Race> races = this.raceRepository.findBySeason(numberSeason);
        List<RaceDTO> raceDTOs = this.raceMapper.convertRacesToRacesDTO(races);
        raceDTOs.sort(Comparator.comparing(RaceDTO::getFinished).reversed());

        List<RaceDTO> raceDTOsNotFinishedAndNextOne = raceDTOs.stream().filter(raceDTO -> raceDTO.getFinished() == 1).collect(Collectors.toList());
        
        for(RaceDTO raceDTO: raceDTOs) {
            if (raceDTO.getFinished() == 0) {
                raceDTOsNotFinishedAndNextOne.add(raceDTO);
                break;
            }
        }

        return raceDTOs;
    }

    /**
     * Retrieves a list of all previous races for a given season.
     *
     * @param numberSeason The season for which races are to be retrieved.
     * @return List of RaceDTO objects representing all previous races.
    */
    public List<RaceDTO> getAllPreviousRaces(int numberSeason) {
        List<Race> races = this.raceRepository.findBySeason(numberSeason);
        List<RaceDTO> raceDTOs = this.raceMapper.convertRacesToRacesDTO(races);
        raceDTOs.sort(Comparator.comparing(RaceDTO::getFinished).reversed());

        return raceDTOs.stream().filter(raceDTO -> raceDTO.getFinished() == 1).collect(Collectors.toList());
    }
}
