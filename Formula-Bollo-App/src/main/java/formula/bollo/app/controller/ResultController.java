package formula.bollo.app.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
import formula.bollo.app.repository.SprintRepository;
import formula.bollo.app.utils.Log;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.v3.oas.annotations.Operation;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@CrossOrigin(origins = "https://formulabollo.es")
@RestController
@RequestMapping(path = {"/results"}, produces = MediaType.APPLICATION_JSON_VALUE)
public class ResultController {
    
    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private DriverMapper driverMapper;

    @Autowired
    private ResultMapper resultMapper;

    @Autowired
    private RaceRepository raceRepository;

    @Autowired
    private PositionRepository positionRepository;

    @Autowired
    private SprintRepository sprintRepository;

    @Operation(summary = "Get results total per driver")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Results successfully obtained"),
        @ApiResponse(code = 404, message = "Results cannot be found"),
        @ApiResponse(code = 500, message = "There was an error, contact with administrator")
    })
    @GetMapping("/totalPerDriver")
    public List<DriverPointsDTO> getTotalResultsPerDriver(@RequestParam(value = "numResults", required = false) Integer numResults) {
        Log.info("START - getTotalResultsPerDriver - START");
        Log.info("RequestParam getTotalResultsPerDriver (numResults) -> " + numResults);
        
        List<Result> results = resultRepository.findAll();
        Map<DriverDTO, Integer> totalPointsByDriver = new HashMap<>();
        
        // Calculate total points for each driver based on results
        for (Result result : results) {
            DriverDTO driverDTO = driverMapper.driverToDriverDTO(result.getDriver());
            int points = 0;

            if (result.getPosition() != null) {
                points = result.getPosition().getPoints();
            }

            int fastlap = result.getFastlap();
            int currentPoints = totalPointsByDriver.getOrDefault(driverDTO, 0);
            totalPointsByDriver.put(driverDTO, currentPoints + points + fastlap);
        }

        // Update total points for each driver based on sprints
        List<Sprint> sprints = sprintRepository.findAll();
        for (Sprint sprint : sprints) {
            DriverDTO driverDTO = driverMapper.driverToDriverDTO(sprint.getDriver());
            int points = 0;
            
            if (sprint.getPosition() != null) {
                points = sprint.getPosition().getPoints();
            }
            
            int currentPoints = totalPointsByDriver.getOrDefault(driverDTO, 0);
            totalPointsByDriver.put(driverDTO, currentPoints + points);
        }
        
        // Create DriverPointsDTO objects for each driver with their total points
        List<DriverPointsDTO> driverPointsDTOList = new ArrayList<>();
        for (Map.Entry<DriverDTO, Integer> entry : totalPointsByDriver.entrySet()) {
            DriverPointsDTO driverPointsDTO = new DriverPointsDTO(entry.getKey(), entry.getValue());
            driverPointsDTOList.add(driverPointsDTO);
        }
        
        // Sort the driverPointsDTOList in descending order of total points
        Comparator<DriverPointsDTO> pointsComparator = Comparator.comparingInt(DriverPointsDTO::getTotalPoints);
        Collections.sort(driverPointsDTOList, pointsComparator.reversed());
        
        // Determine the number of results to return
        int numResultsToReturn = Math.min(driverPointsDTOList.size(), numResults != null ? numResults : Integer.MAX_VALUE);
        
        Log.info("END - getTotalResultsPerDriver - END");

        return driverPointsDTOList.subList(0, numResultsToReturn);
    }
    
    @Operation(summary = "Get results per circuit")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Results successfully obtained"),
        @ApiResponse(code = 404, message = "Results cannot be found"),
        @ApiResponse(code = 500, message = "There was an error, contact with administrator")
    })
    @GetMapping("/circuit")
    public List<ResultDTO> getResultsPerCircuit(@RequestParam("circuitId") Integer circuitId) {
        Log.info("START - getResultsPerCircuit - START");
        Log.info("RequestParam getResultsPerCircuit (circuitId) -> " + circuitId);

        List<ResultDTO> resultDTOs = new ArrayList<>();

        List<Race> races = raceRepository.findByCircuitId((long)circuitId);

        if (races.isEmpty()) {
            return resultDTOs;
        }

        List<Result> results = resultRepository.findByRaceId(races.get(0).getId());

        if (results.isEmpty()) {
            return resultDTOs;
        }

        for (Result result : results) {
            resultDTOs.add(resultMapper.resultToResultDTO(result));
        }

        Comparator<ResultDTO> pointsComparator = Comparator
        .comparing(result -> result.getPosition() != null ? result.getPosition().getPositionNumber() : null,
               Comparator.nullsLast(Integer::compareTo));
        Collections.sort(resultDTOs, pointsComparator);

        Log.info("END - getResultsPerCircuit - END");

        return resultDTOs;
    }

    @Operation(summary = "Save a results")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Races successfully saved"),
        @ApiResponse(code = 404, message = "Races cannot be found"),
        @ApiResponse(code = 500, message = "There was an error, contact with administrator")
    })
    @PutMapping(path = "/save", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> saveCircuit(@RequestBody List<ResultDTO> resultDTOs) {
        Log.info("START - saveCircuit - START");
        Log.info("RequestBody getResultsPerCircuit -> " + resultDTOs.toString());

        try {
            Race race = raceRepository.findByCircuitId(resultDTOs.get(0).getRace().getCircuit().getId()).get(0);

            for(ResultDTO resultDTO : resultDTOs) {
                List<Result> existingResult = resultRepository.findByRaceId(resultDTO.getRace().getId());
                
                if (existingResult.isEmpty()) {
                    Result newResult = resultMapper.resultDTOToResult(resultDTO);

                    if (resultDTO.getPosition() != null) {
                        Position position = positionRepository.findByPositionNumber(resultDTO.getPosition().getPositionNumber()).get(0);
                        newResult.setPosition(position);
                    }
                    
                    newResult.setRace(race);
                    resultRepository.save(newResult);
                } else {
                    Result resultToUpdate = resultMapper.resultDTOToResult(resultDTO);
                    
                    if (resultDTO.getPosition() != null) {
                        Position position = positionRepository.findByPositionNumber(resultDTO.getPosition().getPositionNumber()).get(0);
                        resultToUpdate.setPosition(position);
                    }
                    
                    resultRepository.saveAndFlush(resultToUpdate);
                }
            }
        } catch (DataAccessException e) {
            Log.error("Error inesperado", e);
            return new ResponseEntity<>("Hubo un problema con la base de datos", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            Log.error("Error inesperado", e);
            return new ResponseEntity<>("Error inesperado. Contacta con el administrados", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        Log.info("END - saveCircuit - END");

        return new ResponseEntity<>("Carrera guardada correctamente", HttpStatus.OK);
    }
}
