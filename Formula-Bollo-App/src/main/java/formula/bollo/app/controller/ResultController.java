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
import formula.bollo.app.mapper.DriverMapper;
import formula.bollo.app.mapper.RaceMapper;
import formula.bollo.app.mapper.ResultMapper;
import formula.bollo.app.model.DriverDTO;
import formula.bollo.app.model.DriverPointsDTO;
import formula.bollo.app.model.RaceDTO;
import formula.bollo.app.model.ResultDTO;
import formula.bollo.app.repository.PositionRepository;
import formula.bollo.app.repository.RaceRepository;
import formula.bollo.app.repository.ResultRepository;
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
    private RaceMapper raceMapper;

    @Autowired
    private PositionRepository positionRepository;

    @Operation(summary = "Get results total per driver")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Results successfully obtained"),
        @ApiResponse(code = 404, message = "Results cannot be found"),
        @ApiResponse(code = 500, message = "There was an error, contact with administrator")
    })
    @GetMapping("/totalPerDriver")
    public List<DriverPointsDTO> getTotalResultsPerDriver(@RequestParam(value = "numResults", required = false) Integer numResults) {
        List<Result> results = resultRepository.findAll();
        Map<DriverDTO, Integer> totalPointsByDriver = new HashMap<>();

        // We make the algorithm so that it takes all the results
        // And go adding the points grouping by the driver
        for (Result result : results) {
            DriverDTO driverDTO = driverMapper.driverToDriverDTO(result.getDriver());
            if (result.getPosition() != null) {
                int points = result.getPosition().getPoints();
                int fastlap = result.getFastlap();
                if (totalPointsByDriver.containsKey(driverDTO)) {
                    int currentPoints = totalPointsByDriver.get(driverDTO);
                    totalPointsByDriver.put(driverDTO, currentPoints + points + fastlap);
                } else {
                    totalPointsByDriver.put(driverDTO, points + fastlap);
                }
            }
        }

        // Convert the map to a list of DriverPointsDTO
        List<DriverPointsDTO> driverPointsDTOList = new ArrayList<>();
        for (Map.Entry<DriverDTO, Integer> entry : totalPointsByDriver.entrySet()) {
            DriverPointsDTO driverPointsDTO = new DriverPointsDTO(entry.getKey(), entry.getValue());
            driverPointsDTOList.add(driverPointsDTO);
        }

        // Compare all points and sorted DESC 
        Comparator<DriverPointsDTO> pointsComparator = Comparator.comparingInt(DriverPointsDTO::getTotalPoints);
        Collections.sort(driverPointsDTOList, pointsComparator.reversed());
        
        // Select how many results to return
        int numResultsToReturn = 0;

        if (numResults == null || numResults > driverPointsDTOList.size()) {
            numResultsToReturn = driverPointsDTOList.size();
        } else {
            numResultsToReturn  = Math.min(driverPointsDTOList.size(), numResults);
        }

        return  driverPointsDTOList.subList(0, numResultsToReturn);
    }

    @Operation(summary = "Get results per circuit")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Results successfully obtained"),
        @ApiResponse(code = 404, message = "Results cannot be found"),
        @ApiResponse(code = 500, message = "There was an error, contact with administrator")
    })
    @GetMapping("/resultsPerCircuit")
    public List<ResultDTO> getResultsPerCircuit(@RequestParam("circuitId") Integer circuitId) {
        List<ResultDTO> resultDTOs = new ArrayList<>();

        List<Race> races = raceRepository.findByCircuitId((long)circuitId);

        if (races.isEmpty()) {
            return resultDTOs;
        }

        RaceDTO raceDTO = raceMapper.raceToRaceDTO(races.get(0));
        List<Result> results = resultRepository.findByRaceId(raceDTO.getId());

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

        return resultDTOs;
    }

    @Operation(summary = "Save a results")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Races successfully saved"),
        @ApiResponse(code = 404, message = "Races cannot be found"),
        @ApiResponse(code = 500, message = "There was an error, contact with administrator")
    })
    @PutMapping(path = "/saveResults", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> saveCircuit(@RequestBody List<ResultDTO> resultDTOs) {
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

        return new ResponseEntity<>("Carrera guardada correctamente", HttpStatus.OK);
    }
}
