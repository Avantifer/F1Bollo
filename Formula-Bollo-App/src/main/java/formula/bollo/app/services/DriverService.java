package formula.bollo.app.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import formula.bollo.app.entity.Driver;
import formula.bollo.app.entity.Result;
import formula.bollo.app.entity.Sprint;
import formula.bollo.app.mapper.DriverMapper;
import formula.bollo.app.model.DriverDTO;
import formula.bollo.app.model.DriverInfoDTO;
import formula.bollo.app.repository.ChampionshipRepository;
import formula.bollo.app.repository.DriverRepository;
import formula.bollo.app.repository.PenaltyRepository;
import formula.bollo.app.repository.ResultRepository;
import formula.bollo.app.repository.SprintRepository;

@Service
public class DriverService {
    
    private DriverRepository driverRepository;
    private DriverMapper driverMapper;
    private ResultRepository resultRepository;
    private ResultService resultService;
    private SprintRepository sprintRepository;
    private ChampionshipRepository championshipRepository;
    private PenaltyRepository penaltyRepository;

    public DriverService(
        DriverRepository driverRepository,
        DriverMapper driverMapper,
        ResultRepository resultRepository,
        ResultService resultService,
        SprintRepository sprintRepository,
        ChampionshipRepository championshipRepository,
        PenaltyRepository penaltyRepository
    ) {
        this.driverRepository = driverRepository;
        this.driverMapper = driverMapper;
        this.resultRepository = resultRepository;
        this.resultService = resultService;
        this.sprintRepository = sprintRepository;
        this.championshipRepository = championshipRepository;
        this.penaltyRepository = penaltyRepository;
    }

    /**
     * Retrieves all type of info by the driver name
     *
     * @param drivers list of the drivers with the name filter
    */ 
    public DriverInfoDTO getAllInfoDriver(List<Driver> drivers) {
        DriverInfoDTO driverInfoDTO = new DriverInfoDTO();

        List<Long> listOfIds = drivers.stream().map(Driver::getId).collect(Collectors.toList());
        DriverDTO driverDTO = driverMapper.driverToDriverDTO(drivers.get(drivers.size() - 1));
        
        int poles = 0;
        int fastlaps = 0;
        int racesFinished = 0;
        int totalPoints = 0;
        int championships = 0;
        int penalties = 0;
        int bestPosition = 0;
        int podiums = 0;
        int victories = 0;

        List<Result> results = new ArrayList<>(); 
        List<Sprint> sprints = new ArrayList<>();
        Map<DriverDTO, Integer> totalPointsByDriver = new HashMap<>();
        for(Long id : listOfIds) {
            poles += this.resultRepository.polesByDriverId(id).size();
            fastlaps += this.resultRepository.fastlapByDriverId(id).size();
            racesFinished += this.resultRepository.racesFinishedByDriverId(id).size();
            championships += this.championshipRepository.findByDriverId(id).size();
            penalties += this.penaltyRepository.findByDriverId(id).size();
            podiums += this.resultRepository.podiumsOfDriver(id).size();
            victories += this.resultRepository.victoriesOfDriver(id).size();

            Optional<Result> bestResult = this.resultRepository.bestResultOfDriver(id);
            int bestPositionActual = bestResult.isPresent() ? bestResult.get().getPosition().getPositionNumber() : 0;
            bestPosition = (bestPosition == 0) ? bestPositionActual : Math.min(bestPosition, bestPositionActual);

            results.addAll(this.resultRepository.findByDriverId(id));
            sprints.addAll(this.sprintRepository.findByDriverId(id));
            resultService.setTotalPointsByDriver(results, sprints, totalPointsByDriver);
            Optional<Driver> driver = this.driverRepository.findById(id);
            Integer pointsOfDriver = driver.isPresent() ? totalPointsByDriver.get(this.driverMapper.driverToDriverDTO(driver.get())) : null;
            if (pointsOfDriver == null) break;
            totalPoints +=  pointsOfDriver;
        }
        
        driverInfoDTO.setDriver(driverDTO);
        driverInfoDTO.setPoles(poles);
        driverInfoDTO.setFastlaps(fastlaps);
        driverInfoDTO.setRacesFinished(racesFinished);
        driverInfoDTO.setTotalPoints(totalPoints);
        driverInfoDTO.setChampionships(championships);
        driverInfoDTO.setPenalties(penalties);
        driverInfoDTO.setBestPosition(bestPosition);
        driverInfoDTO.setPodiums(podiums);
        driverInfoDTO.setVictories(victories);
        
        return driverInfoDTO;
    }
}
