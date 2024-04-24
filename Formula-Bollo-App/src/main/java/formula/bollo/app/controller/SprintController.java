package formula.bollo.app.controller;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import formula.bollo.app.entity.Race;
import formula.bollo.app.entity.Season;
import formula.bollo.app.entity.Sprint;
import formula.bollo.app.mapper.SeasonMapper;
import formula.bollo.app.mapper.SprintMapper;
import formula.bollo.app.model.SeasonDTO;
import formula.bollo.app.model.SprintDTO;
import formula.bollo.app.repository.RaceRepository;
import formula.bollo.app.repository.SeasonRepository;
import formula.bollo.app.repository.SprintRepository;
import formula.bollo.app.services.SprintService;
import formula.bollo.app.utils.Constants;
import formula.bollo.app.utils.Log;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = Constants.PRODUCTION_FRONTEND)
@RestController
@RequestMapping(path = {Constants.ENDPOINT_SPRINT}, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = Constants.TAG_SPRINT, description = Constants.TAG_SPRINT_SUMMARY)
public class SprintController {
    
    private SprintRepository sprintRepository;
    private RaceRepository raceRepository;
    private SprintMapper sprintMapper;
    private SprintService sprintService;
    private SeasonRepository seasonRepository;
    private SeasonMapper seasonMapper;

    public SprintController(
        SprintRepository sprintRepository,
        RaceRepository raceRepository,
        SprintMapper sprintMapper,
        SprintService sprintService,
        SeasonRepository seasonRepository,
        SeasonMapper seasonMapper
    ) {
        this.sprintRepository = sprintRepository;
        this.raceRepository = raceRepository;
        this.sprintMapper = sprintMapper;
        this.sprintService = sprintService;
        this.seasonRepository = seasonRepository;
        this.seasonMapper = seasonMapper;
    }
    
    @Operation(summary = "Get sprints per circuit", tags = Constants.TAG_SPRINT)
    @GetMapping("/circuit")
    public List<SprintDTO> getSprintsPerCircuit(@RequestParam("circuitId") Integer circuitId, @RequestParam(value = "season", required = false) Integer season) {
        Log.info("START - getSprintsPerCircuit - START");
        Log.info("RequestParam getSprintsPerCircuit (circuitId) -> " + circuitId);
        Log.info("RequestParam getSprintsPerCircuit (season) -> " + season);

        List<SprintDTO> sprintDTOs = new ArrayList<>();

        int numberSeason = season == null ? Constants.ACTUAL_SEASON : season;
        List<Race> races = raceRepository.findByCircuitId((long)circuitId, numberSeason);
        if (races.isEmpty()) return sprintDTOs;

        List<Sprint> sprints = sprintRepository.findByRaceId(races.get(0).getId());
        if (sprints.isEmpty()) return sprintDTOs;
        
        sprintDTOs = sprintMapper.convertSprintsToSprintsDTO(sprints);        
        sprintService.orderSprintsByPoints(sprintDTOs);

        Log.info("END - getSprintsPerCircuit - END");

        return sprintDTOs;
    }

    @Operation(summary = "Save sprints", tags = Constants.TAG_SPRINT)
    @PutMapping(path = "/save", produces = MediaType.TEXT_PLAIN_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveSprintsCircuit(@RequestBody List<SprintDTO> sprintDTOs, @RequestParam(value = "season", required = false) Integer season) {
        Log.info("START - saveSprintsCircuit - START");
        Log.info("RequestBody saveSprintsCircuit -> " + sprintDTOs.toString());
        Log.info("RequestParam saveSprintsCircuit (season) -> " + season);

        int numberSeason = season == null ? Constants.ACTUAL_SEASON : season;
        if (sprintDTOs.isEmpty()) return new ResponseEntity<>("No hay resultados", Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(500));

        SprintDTO firstSprint = sprintDTOs.get(0);
        List<Sprint> existingSprints = this.sprintRepository.findByRaceId(firstSprint.getRace().getId());
        
        try {
            List<Season> seasons = this.seasonRepository.findByNumber(numberSeason);
            if (seasons.isEmpty()) return new ResponseEntity<>(Constants.ERROR_SEASON, Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(500));
            SeasonDTO seasonToSave = this.seasonMapper.seasonToSeasonDTO(seasons.get(0));
            sprintDTOs.forEach((SprintDTO sprintDTO) -> sprintDTO.setSeason(seasonToSave));
            
            sprintRepository.deleteAll(existingSprints);
            sprintService.saveSprints(sprintDTOs, numberSeason);
        } catch (DataAccessException e) {
            Log.error(Constants.ERROR_UNEXPECTED, e);
            return new ResponseEntity<>(Constants.ERROR_BBDD_GENERIC, Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(500));
        } catch (Exception e) {
            Log.error(Constants.ERROR_UNEXPECTED, e);
            return new ResponseEntity<>(Constants.ERROR_GENERIC, Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(500));
        }

        Log.info("END - saveSprintsCircuit - END");

        return new ResponseEntity<>("Resultados guardados correctamente", Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(200));
    }
}
