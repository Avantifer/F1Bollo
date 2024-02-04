package formula.bollo.app.services;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import formula.bollo.app.entity.Driver;
import formula.bollo.app.entity.Penalty;
import formula.bollo.app.entity.Race;
import formula.bollo.app.mapper.DriverMapper;
import formula.bollo.app.mapper.PenaltyMapper;
import formula.bollo.app.mapper.RaceMapper;
import formula.bollo.app.model.DriverDTO;
import formula.bollo.app.model.DriverPenaltiesDTO;
import formula.bollo.app.model.PenaltyDTO;
import formula.bollo.app.model.RacePenaltiesDTO;
import formula.bollo.app.repository.PenaltyRepository;

@Service
public class PenaltyService {

    private final PenaltyMapper penaltyMapper;

    private final DriverMapper driverMapper;

    private final RaceMapper raceMapper;

    private final PenaltyRepository penaltyRepository;
    
    public PenaltyService(
        PenaltyMapper penaltyMapper,
        DriverMapper driverMapper,
        RaceMapper raceMapper,
        PenaltyRepository penaltyRepository
    ) {
        this.penaltyMapper = penaltyMapper;
        this.driverMapper = driverMapper;
        this.raceMapper = raceMapper;
        this.penaltyRepository = penaltyRepository;
    }

    /**
     * Saves penalties from a list of PenaltyDTO objects to a repository.
     *
     * @param penaltyDTOs The list of PenaltyDTO objects to be saved.
    */
    public void savePenalties(List<PenaltyDTO> penaltyDTOs) {
        penaltyDTOs.parallelStream()
            .map(penaltyMapper::penaltyDTOToPenalty)
            .filter(penalty -> !penalty.getReason().isEmpty())
            .forEach(penaltyRepository::save);
    }

    /**
     * Adds penalties to a driver's race penalty map.
     *
     * @param penalties              The list of penalties to be added.
     * @param driverRacePenaltiesMap The map containing driver-race-penalty information.
    */
    public void addPenaltyToDriver(List<Penalty> penalties, Map<Driver, Map<Race, List<Penalty>>> driverRacePenaltiesMap) {
        penalties.forEach((Penalty penalty) -> driverRacePenaltiesMap
                        .computeIfAbsent(penalty.getDriver(), driver -> new HashMap<>())
                        .computeIfAbsent(penalty.getRace(), race -> new ArrayList<>())
                        .add(penalty)
        );
    }

    /**
     * Maps driver-race-penalty information to a list of DriverPenaltiesDTO objects.
     *
     * @param driverRacePenaltiesMap The map containing driver-race-penalty information.
     * @return                      A list of DriverPenaltiesDTO objects.
    */
    public List<DriverPenaltiesDTO> mapDriverRacePenalties(Map<Driver, Map<Race, List<Penalty>>> driverRacePenaltiesMap) {
        return driverRacePenaltiesMap.entrySet().stream()
            .map(this::mapDriverToDriverPenaltiesDTO)
            .sorted(Comparator.comparingLong((DriverPenaltiesDTO dto) -> dto.getDriver().getId()))
            .collect(Collectors.toList());
    }
    
    /**
     * Maps driver information to a DriverPenaltiesDTO object.
     *
     * @param driverEntry The entry containing driver-race-penalty information.
     * @return            A DriverPenaltiesDTO object.
    */
    private DriverPenaltiesDTO mapDriverToDriverPenaltiesDTO(Map.Entry<Driver, Map<Race, List<Penalty>>> driverEntry) {
        Driver driver = driverEntry.getKey();
        DriverDTO driverDTO = driverMapper.driverToDriverDTONoImage(driver);
    
        List<RacePenaltiesDTO> racePenaltiesDTOs = driverEntry.getValue().entrySet().stream()
            .map(this::mapRaceToRacePenaltiesDTO)
            .collect(Collectors.toList());
    
        DriverPenaltiesDTO driverPenaltiesDTO = new DriverPenaltiesDTO();
        driverPenaltiesDTO.setDriver(driverDTO);
        driverPenaltiesDTO.setRacePenalties(racePenaltiesDTOs);
    
        return driverPenaltiesDTO;
    }
    
    /**
     * Maps race information to a RacePenaltiesDTO object.
     *
     * @param raceEntry The entry containing race-penalty information.
     * @return          A RacePenaltiesDTO object.
    */
    private RacePenaltiesDTO mapRaceToRacePenaltiesDTO(Map.Entry<Race, List<Penalty>> raceEntry) {
        Race race = raceEntry.getKey();
        List<PenaltyDTO> penaltyDTOs = raceEntry.getValue().stream()
            .map(penaltyMapper::penaltyToPenaltyDTO)
            .collect(Collectors.toList());
    
        RacePenaltiesDTO racePenaltiesDTO = new RacePenaltiesDTO();
        racePenaltiesDTO.setRace(raceMapper.raceToRaceDTO(race));
        racePenaltiesDTO.setPenalties(penaltyDTOs);
    
        return racePenaltiesDTO;
    }
}
