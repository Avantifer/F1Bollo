package formula.bollo.app.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.OptionalInt;
import java.util.concurrent.ConcurrentHashMap;

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

    public static final Map<String, DriverInfoDTO> cacheDriverInfoDTO = new ConcurrentHashMap<>();

    /**
     * Retrieves all type of info by the driver name
     *
     * @param drivers list of the drivers with the name filter
    */ 
    public DriverInfoDTO getAllInfoDriver(List<Driver> drivers) {
        DriverInfoDTO driverInfoDTO = new DriverInfoDTO();

        List<Long> listOfIds = drivers.stream().map(Driver::getId).toList();
        DriverDTO driverDTO = driverMapper.driverToDriverDTO(drivers.get(drivers.size() - 1));

        int poles = listOfIds.stream().mapToInt(id -> this.resultRepository.polesByDriverId(id).size()).sum();
        int fastlaps = listOfIds.stream().mapToInt(id -> this.resultRepository.fastlapByDriverId(id).size()).sum();
        int racesFinished = listOfIds.stream().mapToInt(id -> this.resultRepository.racesFinishedByDriverId(id).size()).sum();
        int championships = listOfIds.stream().mapToInt(id -> this.championshipRepository.findByDriverId(id).size()).sum();
        int penalties = listOfIds.stream().mapToInt(id -> this.penaltyRepository.findByDriverId(id).size()).sum();
        int podiums = listOfIds.stream().mapToInt(id -> this.resultRepository.podiumsOfDriver(id).size()).sum();
        int victories = listOfIds.stream().mapToInt(id -> this.resultRepository.victoriesOfDriver(id).size()).sum();

        OptionalInt bestPositionOptional = listOfIds.stream()
                .mapToInt(id -> this.resultRepository.bestResultOfDriver(id).map(result -> result.getPosition().getPositionNumber()).orElse(0))
                .min();
        int bestPosition = bestPositionOptional.orElse(0);

        List<Result> results = listOfIds.stream().flatMap(id -> this.resultRepository.findByDriverId(id).stream()).toList();
        List<Sprint> sprints = listOfIds.stream().flatMap(id -> this.sprintRepository.findByDriverId(id).stream()).toList();

        Map<DriverDTO, Integer> totalPointsByDriver = new HashMap<>();
        resultService.setTotalPointsByDriver(results, sprints, totalPointsByDriver);

        int totalPoints = listOfIds.stream()
                .mapToInt(id -> {
                    Optional<Driver> driver = this.driverRepository.findById(id);
                    return driver.isPresent() ? totalPointsByDriver.getOrDefault(this.driverMapper.driverToDriverDTO(driver.get()), 0) : 0;
                })
                .sum();

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

    public List<DriverInfoDTO> sumDuplicates(List<DriverInfoDTO> driversInfoDTO) {
        // Using LinkedHashMap to maintain insertion order
        Map<String, DriverInfoDTO> resultMap = new LinkedHashMap<>();

        for (DriverInfoDTO driverInfo : driversInfoDTO) {
            String driverName = driverInfo.getDriver().getName();

            // Merge data for duplicate drivers
            resultMap.merge(driverName, driverInfo, (existingDriverInfo, newDriverInfo) -> {
                existingDriverInfo.setDriver(newDriverInfo.getDriver());
                existingDriverInfo.setPoles(existingDriverInfo.getPoles() + newDriverInfo.getPoles());
                existingDriverInfo.setFastlaps(existingDriverInfo.getFastlaps() + newDriverInfo.getFastlaps());
                existingDriverInfo.setRacesFinished(existingDriverInfo.getRacesFinished() + newDriverInfo.getRacesFinished());
                existingDriverInfo.setTotalPoints(existingDriverInfo.getTotalPoints() + newDriverInfo.getTotalPoints());
                existingDriverInfo.setChampionships(existingDriverInfo.getChampionships() + newDriverInfo.getChampionships());
                existingDriverInfo.setPenalties(existingDriverInfo.getPenalties() + newDriverInfo.getPenalties());
                existingDriverInfo.setBestPosition(Math.max(existingDriverInfo.getBestPosition(), newDriverInfo.getBestPosition()));
                existingDriverInfo.setVictories(existingDriverInfo.getVictories() + newDriverInfo.getVictories());
                existingDriverInfo.setPodiums(existingDriverInfo.getPodiums() + newDriverInfo.getPodiums());
                return existingDriverInfo;
            });
        }

        return new ArrayList<>(resultMap.values());
    }
}
