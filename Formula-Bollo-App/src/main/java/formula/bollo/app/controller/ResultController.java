package formula.bollo.app.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import formula.bollo.app.entity.Race;
import formula.bollo.app.entity.Result;
import formula.bollo.app.entity.Sprint;
import formula.bollo.app.mapper.ResultMapper;
import formula.bollo.app.model.DriverDTO;
import formula.bollo.app.model.DriverPointsDTO;
import formula.bollo.app.model.ResultDTO;
import formula.bollo.app.repository.RaceRepository;
import formula.bollo.app.repository.ResultRepository;
import formula.bollo.app.repository.SprintRepository;
import formula.bollo.app.services.ResultService;
import formula.bollo.app.utils.Constants;
import formula.bollo.app.utils.Log;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@CrossOrigin(origins = Constants.URL_FRONTED)
@RestController
@RequestMapping(path = {Constants.ENDPOINT_RESULT}, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = Constants.TAG_RESULT, description = Constants.TAG_RESULT_SUMMARY)
public class ResultController {
    
    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private RaceRepository raceRepository;


    @Autowired
    private SprintRepository sprintRepository;

    @Autowired
    private ResultMapper resultMapper;

    @Autowired
    private ResultService resultService;


    @Operation(summary = "Get results total per driver", tags = Constants.TAG_RESULT)
    @GetMapping("/totalPerDriver")
    public List<DriverPointsDTO> getTotalResultsPerDriver(@RequestParam(value = "numResults", required = false) Integer numResults) {
        Log.info("START - getTotalResultsPerDriver - START");
        Log.info("RequestParam getTotalResultsPerDriver (numResults) -> " + numResults);
        
        List<Result> results = resultRepository.findAll();
        Map<DriverDTO, Integer> totalPointsByDriver = new HashMap<>();
        List<DriverPointsDTO> driverPointsDTOList = new ArrayList<>();

        if (results.isEmpty()) return driverPointsDTOList;

        List<Sprint> sprints = sprintRepository.findAll();
        driverPointsDTOList = resultService.setTotalPointsByDriver(results, sprints, totalPointsByDriver);
        int numResultsToReturn = Math.min(driverPointsDTOList.size(), numResults != null ? numResults : Integer.MAX_VALUE);
        
        Log.info("END - getTotalResultsPerDriver - END");

        return driverPointsDTOList.subList(0, numResultsToReturn);
    }
    
    @Operation(summary = "Get results per circuit", tags = Constants.TAG_RESULT)
    @GetMapping("/circuit")
    public List<ResultDTO> getResultsPerCircuit(@RequestParam("circuitId") Integer circuitId) {
        Log.info("START - getResultsPerCircuit - START");
        Log.info("RequestParam getResultsPerCircuit (circuitId) -> " + circuitId);

        List<ResultDTO> resultDTOs = new ArrayList<>();

        List<Race> races = raceRepository.findByCircuitId((long)circuitId);
        if (races.isEmpty()) return resultDTOs;

        List<Result> results = resultRepository.findByRaceId(races.get(0).getId());
        if (results.isEmpty()) return resultDTOs;
        
        resultDTOs = resultMapper.convertResultsToResultsDTO(results);        
        resultService.orderResultsByPoints(resultDTOs);

        Log.info("END - getResultsPerCircuit - END");

        return resultDTOs;
    }

    @Operation(summary = "Save results", tags = Constants.TAG_RESULT)
    @PutMapping(path = "/save", produces = MediaType.TEXT_PLAIN_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveResultsCircuit(@RequestBody List<ResultDTO> resultDTOs) {
        Log.info("START - saveResultsCircuit - START");
        Log.info("RequestBody saveResultsCircuit -> " + resultDTOs.toString());

        if (resultDTOs.isEmpty()) return new ResponseEntity<>("No hay resultados", Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(500));

        try {
            resultService.saveResults(resultDTOs);
        } catch (DataAccessException e) {
            Log.error(Constants.ERROR_UNEXPECTED, e);
            return new ResponseEntity<>(Constants.ERROR_BBDD_GENERIC, Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(500));
        } catch (Exception e) {
            Log.error(Constants.ERROR_UNEXPECTED, e);
            return new ResponseEntity<>(Constants.ERROR_GENERIC, Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(500));
        }

        Log.info("END - saveResultsCircuit - END");

        return new ResponseEntity<>("Resultados guardados correctamente", Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(200));
    }
}
