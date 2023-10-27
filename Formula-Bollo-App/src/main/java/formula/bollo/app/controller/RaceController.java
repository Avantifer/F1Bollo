package formula.bollo.app.controller;

import formula.bollo.app.entity.Race;
import formula.bollo.app.entity.Season;
import formula.bollo.app.mapper.RaceMapper;
import formula.bollo.app.mapper.SeasonMapper;
import formula.bollo.app.model.RaceDTO;
import formula.bollo.app.model.SeasonDTO;
import formula.bollo.app.repository.RaceRepository;
import formula.bollo.app.repository.SeasonRepository;
import formula.bollo.app.services.RaceService;
import formula.bollo.app.utils.Constants;
import formula.bollo.app.utils.Log;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

@CrossOrigin(origins = Constants.PRODUCTION_FRONTEND)
@RestController
@RequestMapping(path = {Constants.ENDPOINT_RACE}, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = Constants.TAG_RACE, description = Constants.TAG_RACE_SUMMARY)
public class RaceController {
    
    @Autowired
    private RaceRepository raceRepository;

    @Autowired
    private RaceMapper raceMapper;

    @Autowired
    private RaceService raceService;

    @Autowired
    private SeasonRepository seasonRepository;

    @Autowired
    private SeasonMapper seasonMapper;

    @Operation(summary = "Get races per circuit", tags = Constants.TAG_RACE)
    @GetMapping("/circuit")
    public List<RaceDTO> getRacesPerCircuit(@RequestParam("circuitId") Integer circuitId, @RequestParam(value = "season", required = false) Integer season) {
        Log.info("START - getRacesPerCircuit - START");
        Log.info("RequestParam getRacesPerCircuit (circuitId) -> " + circuitId);
        Log.info("RequestParam getRacesPerCircuit (season) -> " + season);

        int numberSeason = season == null ? Constants.ACTUAL_SEASON : season;
        List<RaceDTO> raceDTOs = new ArrayList<>();
        List<Race> races = raceRepository.findByCircuitId((long) circuitId, numberSeason);
        if (races.isEmpty()) return raceDTOs;
        raceDTOs = raceMapper.convertRacesToRacesDTO(races);
        
        Log.info("END - getRacesPerCircuit - END");

        return raceDTOs;
    }

    @Operation(summary = "Save a race", tags = Constants.TAG_RACE)
    @PutMapping(path = "/save", produces = MediaType.TEXT_PLAIN_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveCircuit(@RequestBody RaceDTO raceDTO, @RequestParam(value = "season", required = false) Integer season) {
        Log.info("START - saveCircuit - START");
        Log.info("RequestBody saveCircuit -> " + raceDTO);
        Log.info("RequestParam saveCircuit (seaon) -> " + season);
        
        int numberSeason = season == null ? Constants.ACTUAL_SEASON : season;

        try {
            List<Season> seasons = this.seasonRepository.findByNumber(numberSeason);
            if (seasons.isEmpty()) return new ResponseEntity<>(Constants.ERROR_SEASON, Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(500));
            SeasonDTO seasonToSave = this.seasonMapper.seasonToSeasonDTO(seasons.get(0));
            raceDTO.setSeason(seasonToSave);

            raceService.saveRace(raceDTO, numberSeason);
        } catch (DataAccessException e) {
            return new ResponseEntity<>(Constants.ERROR_BBDD_GENERIC, Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(500));
        } catch (Exception e) {
            return new ResponseEntity<>(Constants.ERROR_GENERIC, Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(500));
        }
        
        Log.info("END - saveCircuit - END");

        return new ResponseEntity<>("Carrera guardada correctamente", Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(200));
    }
}