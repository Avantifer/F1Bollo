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

    public DriverInfoDTO getAllInfoDriver(List<Driver> drivers) {
        DriverInfoDTO driverInfoDTO = new DriverInfoDTO();

        List<Long> listOfIds = drivers.stream().map(Driver::getId).collect(Collectors.toList());
        DriverDTO driverDTO = driverMapper.driverToDriverDTO(drivers.get(drivers.size() - 1));
        
        int podiums = 0;
        int fastlaps = 0;
        int racesFinished = 0;
        int totalPoints = 0;
        int championships = 0;
        int penalties = 0;
        int bestPosition = 0;

        List<Result> results = new ArrayList<>(); 
        List<Sprint> sprints = new ArrayList<>();
        Map<DriverDTO, Integer> totalPointsByDriver = new HashMap<>();
        for(Long id : listOfIds) {
            podiums += this.resultRepository.polesByDriverId(id).size();
            fastlaps += this.resultRepository.fastlapByDriverId(id).size();
            racesFinished += this.resultRepository.racesFinishedByDriverId(id).size();
            championships += this.championshipRepository.findByDriverId(id).size();
            penalties += this.penaltyRepository.findByDriverId(id).size();

            Optional<Result> bestResult = this.resultRepository.bestResultOfDriver(id);
            bestPosition = bestResult.isPresent() ? bestResult.get().getPosition().getPositionNumber() : 0;

            results.addAll(this.resultRepository.findByDriverId(id));
            sprints.addAll(this.sprintRepository.findByDriverId(id));
            resultService.setTotalPointsByDriver(results, sprints, totalPointsByDriver);
            Optional<Driver> driver = this.driverRepository.findById(id);
            Integer pointsOfDriver = driver.isPresent() ? totalPointsByDriver.get(this.driverMapper.driverToDriverDTO(driver.get())) : null;
            if (pointsOfDriver == null) break;
            totalPoints +=  pointsOfDriver;
        }
        
        driverInfoDTO.setDriver(driverDTO);
        driverInfoDTO.setPodiums(podiums);
        driverInfoDTO.setFastlaps(fastlaps);
        driverInfoDTO.setRacesFinished(racesFinished);
        driverInfoDTO.setTotalPoints(totalPoints);
        driverInfoDTO.setChampionships(championships);
        driverInfoDTO.setPenalties(penalties);
        driverInfoDTO.setBestPosition(bestPosition);
        
        return driverInfoDTO;
    }
}
