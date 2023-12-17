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
import formula.bollo.app.entity.Season;
import formula.bollo.app.entity.Sprint;
import formula.bollo.app.mapper.ResultMapper;
import formula.bollo.app.mapper.SeasonMapper;
import formula.bollo.app.model.DriverDTO;
import formula.bollo.app.model.DriverPointsDTO;
import formula.bollo.app.model.ResultDTO;
import formula.bollo.app.model.SeasonDTO;
import formula.bollo.app.repository.RaceRepository;
import formula.bollo.app.repository.ResultRepository;
import formula.bollo.app.repository.SeasonRepository;
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

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@CrossOrigin(origins = "http://192.168.1.135:4200")
@RestController
@RequestMapping(path = {Constants.ENDPOINT_RESULT}, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = Constants.TAG_RESULT, description = Constants.TAG_RESULT_SUMMARY)
public class ResultController {
    
    private ResultRepository resultRepository;
    private RaceRepository raceRepository;
    private SprintRepository sprintRepository;
    private ResultMapper resultMapper;
    private ResultService resultService;
    private SeasonRepository seasonRepository;
    private SeasonMapper seasonMapper;

    public ResultController(
        ResultRepository resultRepository,
        RaceRepository raceRepository,
        SprintRepository sprintRepository,
        ResultMapper resultMapper,
        ResultService resultService,
        SeasonRepository seasonRepository,
        SeasonMapper seasonMapper
    ) {
        this.resultRepository = resultRepository;
        this.raceRepository = raceRepository;
        this.sprintRepository = sprintRepository;
        this.resultMapper = resultMapper;
        this.resultService = resultService;
        this.seasonRepository = seasonRepository;
        this.seasonMapper = seasonMapper;
    }

    @Operation(summary = "Get results total per driver", tags = Constants.TAG_RESULT)
    @GetMapping("/totalPerDriver")
    public List<DriverPointsDTO> getTotalResultsPerDriver(@RequestParam(value = "numResults", required = false) Integer numResults, @RequestParam(value = "season", required = false) Integer season) {
        Log.info("START - getTotalResultsPerDriver - START");
        Log.info("RequestParam getTotalResultsPerDriver (numResults) -> " + numResults);
        Log.info("RequestParam getTotalResultsPerDriver (season) -> " + season);

        int numberSeason = season == null ? Constants.ACTUAL_SEASON : season;
        List<Result> results = resultRepository.findBySeason(numberSeason);
        Map<DriverDTO, Integer> totalPointsByDriver = new HashMap<>();
        List<DriverPointsDTO> driverPointsDTOList = new ArrayList<>();

        if (results.isEmpty()) return driverPointsDTOList;

        List<Sprint> sprints = sprintRepository.findBySeason(numberSeason);
        driverPointsDTOList = resultService.setTotalPointsByDriver(results, sprints, totalPointsByDriver);
        int numResultsToReturn = Math.min(driverPointsDTOList.size(), numResults != null ? numResults : Integer.MAX_VALUE);
        
        Log.info("END - getTotalResultsPerDriver - END");

        return driverPointsDTOList.subList(0, numResultsToReturn);
    }
    
    @Operation(summary = "Get results per circuit", tags = Constants.TAG_RESULT)
    @GetMapping("/circuit")
    public List<ResultDTO> getResultsPerCircuit(@RequestParam("circuitId") Integer circuitId, @RequestParam(value = "season", required = false) Integer season) {
        Log.info("START - getResultsPerCircuit - START");
        Log.info("RequestParam getResultsPerCircuit (circuitId) -> " + circuitId);
        Log.info("RequestParam getResultsPerCircuit (season) -> " + season);

        List<ResultDTO> resultDTOs = new ArrayList<>();

        int numberSeason = season == null ? Constants.ACTUAL_SEASON : season;
        List<Race> races = raceRepository.findByCircuitId((long)circuitId, numberSeason);
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
    public ResponseEntity<String> saveResultsCircuit(@RequestBody List<ResultDTO> resultDTOs, @RequestParam(value = "season", required = false) Integer season) {
        Log.info("START - saveResultsCircuit - START");
        Log.info("RequestBody saveResultsCircuit -> " + resultDTOs.toString());
        Log.info("RequestParam saveResultsCircuit (season) -> " + season);

        int numberSeason = season == null ? Constants.ACTUAL_SEASON : season;

        if (resultDTOs.isEmpty()) return new ResponseEntity<>("No hay resultados", Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(500));

        try {
            List<Season> seasons = this.seasonRepository.findByNumber(numberSeason);
            if (seasons.isEmpty()) return new ResponseEntity<>(Constants.ERROR_SEASON, Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(500));
            SeasonDTO seasonToSave = this.seasonMapper.seasonToSeasonDTO(seasons.get(0));
            resultDTOs.forEach((ResultDTO resultDTO) -> resultDTO.setSeason(seasonToSave));

            resultService.saveResults(resultDTOs, numberSeason);
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
