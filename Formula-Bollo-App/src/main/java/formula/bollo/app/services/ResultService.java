package formula.bollo.app.services;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import formula.bollo.app.entity.Position;
import formula.bollo.app.entity.Race;
import formula.bollo.app.entity.Result;
import formula.bollo.app.entity.Sprint;
import formula.bollo.app.mapper.DriverMapper;
import formula.bollo.app.mapper.ResultMapper;
import formula.bollo.app.model.DriverDTO;
import formula.bollo.app.model.DriverPointsDTO;
import formula.bollo.app.model.ResultDTO;
import formula.bollo.app.repository.PositionRepository;
import formula.bollo.app.repository.RaceRepository;
import formula.bollo.app.repository.ResultRepository;

@Service
public class ResultService {

    @Autowired
    private DriverMapper driverMapper;

    @Autowired
    private RaceRepository raceRepository;
    
    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private ResultMapper resultMapper;

    @Autowired
    private PositionRepository positionRepository;

    /**
     * Calculates and sets total points by driver based on race results and sprint results.
     * The results are sorted by total points in descending order, and a list of DriverPointsDTO
     * objects is returned.
     *
     * @param results             The list of race results.
     * @param sprints             The list of sprint results.
     * @param totalPointsByDriver A map to store total points by driver.
     * @return                    A sorted list of DriverPointsDTO objects.
    */
    public List<DriverPointsDTO> setTotalPointsByDriver(List<Result> results, List<Sprint> sprints, Map<DriverDTO, Integer> totalPointsByDriver) {
        setTotalResultPointsByDriver(results, totalPointsByDriver);

        if (!sprints.isEmpty()) {
            setTotalSprintsPointsByDriver(sprints, totalPointsByDriver);
        }

        return totalPointsByDriver.entrySet()
            .stream()
            .map(entry -> new DriverPointsDTO(entry.getKey(), entry.getValue()))
            .sorted(Comparator.comparingInt(DriverPointsDTO::getTotalPoints).reversed())
            .collect(Collectors.toList());
    }

    /**
     * Calculates and sets total points for race results by driver.
     *
     * @param results             The list of race results.
     * @param totalPointsByDriver A map to store total points by driver.
    */
    private void setTotalResultPointsByDriver(List<Result> results, Map<DriverDTO, Integer> totalPointsByDriver ) {
        results.stream().forEach((Result result) -> {
            DriverDTO driverDTO = driverMapper.driverToDriverDTO(result.getDriver());
            int points = 0;

            if (result.getPosition() != null) {
                points = result.getPosition().getPoints();
            }

            int fastlap = result.getFastlap();
            int currentPoints = totalPointsByDriver.getOrDefault(driverDTO, 0);

            totalPointsByDriver.put(driverDTO, currentPoints + points + fastlap);
        });
    }

    /**
     * Calculates and sets total points for sprint results by driver.
     *
     * @param sprints             The list of sprint results.
     * @param totalPointsByDriver A map to store total points by driver.
    */
    private void setTotalSprintsPointsByDriver(List<Sprint> sprints, Map<DriverDTO, Integer> totalPointsByDriver) {
        sprints.stream().forEach((Sprint sprint) -> {
            DriverDTO driverDTO = driverMapper.driverToDriverDTO(sprint.getDriver());
            int points = 0;
            
            if (sprint.getPosition() != null) {
                points = sprint.getPosition().getPoints();
            }
            
            int currentPoints = totalPointsByDriver.getOrDefault(driverDTO, 0);
            totalPointsByDriver.put(driverDTO, currentPoints + points);
        });
        
    }

    /**
     * Orders a list of ResultDTO objects by their positions (if available).
     *
     * @param resultDTOs The list of ResultDTO objects to be ordered.
    */
    public void orderResultsByPoints(List<ResultDTO> resultDTOs) {
        Comparator<ResultDTO> pointsComparator = Comparator
        .comparing(result -> result.getPosition() != null ? result.getPosition().getPositionNumber() : null,
               Comparator.nullsLast(Integer::compareTo));
        Collections.sort(resultDTOs, pointsComparator);
    }

    /**
     * Saves a list of ResultDTO objects to the repository.
     *
     * @param resultDTOs The list of ResultDTO objects to be saved.
    */
    public void saveResults(List<ResultDTO> resultDTOs, int numberSeason) {
        Race race = raceRepository.findByCircuitId(resultDTOs.get(0).getRace().getCircuit().getId(), numberSeason).get(0);

        resultDTOs.stream().forEach((ResultDTO resultDTO) -> {
            List<Result> existingResult = resultRepository.findByRaceId(resultDTO.getRace().getId());
            Result resultToUpdate = resultMapper.resultDTOToResult(resultDTO);

            if (existingResult.isEmpty()) {
                resultToUpdate.setRace(race);
            }

            if (resultDTO.getPosition() != null) {
                Position position = positionRepository.findByPositionNumber(resultDTO.getPosition().getPositionNumber()).get(0);
                resultToUpdate.setPosition(position);
            }

            resultRepository.save(resultToUpdate);
        });
    }
}
