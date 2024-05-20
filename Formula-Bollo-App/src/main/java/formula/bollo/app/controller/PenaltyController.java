package formula.bollo.app.controller;

import formula.bollo.app.entity.Driver;
import formula.bollo.app.entity.Penalty;
import formula.bollo.app.entity.Race;
import formula.bollo.app.entity.Season;
import formula.bollo.app.mapper.PenaltyMapper;
import formula.bollo.app.mapper.SeasonMapper;
import formula.bollo.app.model.DriverPenaltiesDTO;
import formula.bollo.app.model.PenaltyDTO;
import formula.bollo.app.model.SeasonDTO;
import formula.bollo.app.repository.PenaltyRepository;
import formula.bollo.app.repository.RaceRepository;
import formula.bollo.app.repository.SeasonRepository;
import formula.bollo.app.services.PenaltyService;
import formula.bollo.app.utils.Constants;
import formula.bollo.app.utils.Log;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
@RequestMapping(path = {Constants.ENDPOINT_PENALTY}, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = Constants.TAG_PENALTY, description = Constants.TAG_PENALTY_SUMMARY)
public class PenaltyController {

    private PenaltyRepository penaltyRepository;
    private RaceRepository raceRepository;
    private PenaltyMapper penaltyMapper;
    private PenaltyService penaltyService;
    private SeasonRepository seasonRepository;
    private SeasonMapper seasonMapper;

    public PenaltyController(
        PenaltyRepository penaltyRepository,
        RaceRepository raceRepository,
        PenaltyMapper penaltyMapper,
        PenaltyService penaltyService,
        SeasonRepository seasonRepository,
        SeasonMapper seasonMapper
    ) {
        this.penaltyRepository = penaltyRepository;
        this.raceRepository = raceRepository;
        this.penaltyMapper = penaltyMapper;
        this.penaltyService = penaltyService;
        this.seasonRepository = seasonRepository;
        this.seasonMapper = seasonMapper;
    }

    @Operation(summary = "Get all penalties", tags = Constants.TAG_PENALTY)
    @GetMapping("/all")
    public List<PenaltyDTO> getAllPenalties(@RequestParam(value = "season", required = false) Integer season) {
        Log.info("START - getAllPenalties - START");
        Log.info("RequestParam getAllPenalties (season) -> " + season);

        int numberSeason = season == null ? Constants.ACTUAL_SEASON : season;
        List<Penalty> penalties = penaltyRepository.findBySeason(numberSeason);
        List<PenaltyDTO> penaltyDTOs = new ArrayList<>();

        if (penalties.isEmpty()) return penaltyDTOs;
        penaltyDTOs = penaltyMapper.convertPenaltiesToPenaltiesDTO(penalties);
        
        Log.info("END - getAllPenalties - END");

        return penaltyDTOs;
    }

    @Operation(summary = "Get penalties per circuit", tags = Constants.TAG_PENALTY)
    @GetMapping("/circuit")
    public List<PenaltyDTO> getPenaltiesByCircuit(@RequestParam("circuitId") Integer circuitId, @RequestParam(value = "season", required = false) Integer season) {
        Log.info("START - getPenaltiesByCircuit - START");
        Log.info("RequestParam getPenaltiesByCircuit (circuitId) -> " + circuitId);
        Log.info("RequestParam getPenaltiesByCircuit (season) -> " + season);

        int numberSeason = season == null ? Constants.ACTUAL_SEASON : season;
        List<Race> races = raceRepository.findByCircuitId((long) circuitId, numberSeason);
        List<PenaltyDTO> penaltyDTOs = new ArrayList<>();

        if (races.isEmpty()) return penaltyDTOs;
        List<Penalty> penalties = penaltyRepository.findByRaceId(races.get(0).getId(), numberSeason);

        if (penalties.isEmpty()) return penaltyDTOs;
        penaltyDTOs = penaltyMapper.convertPenaltiesToPenaltiesDTO(penalties);

        Log.info("END - getPenaltiesByCircuit - END");

        return penaltyDTOs;
    }

    @Operation(summary = "Get penalties per driver", tags = Constants.TAG_PENALTY)
    @GetMapping("/totalPerDriver")
    public List<DriverPenaltiesDTO> getPenaltiesByDriverAndRace(@RequestParam(value = "season", required = false) Integer season) {
        Log.info("START - getPenaltiesByDriverAndRace - START");
        Log.info("RequestParam getPenaltiesByDriverAndRace (season) " + season);
        
        int numberSeason = season == null ? Constants.ACTUAL_SEASON : season;

        List<DriverPenaltiesDTO> driversWithPenalties = new ArrayList<>();
        List<Penalty> penalties = penaltyRepository.findBySeason(numberSeason);

        if (penalties.isEmpty()) return driversWithPenalties;
        Map<Driver, Map<Race, List<Penalty>>> driverRacePenaltiesMap = new HashMap<>();

        penaltyService.addPenaltyToDriver(penalties, driverRacePenaltiesMap);
        driversWithPenalties = penaltyService.mapDriverRacePenalties(driverRacePenaltiesMap);
    
        Log.info("END - getPenaltiesByDriverAndRace - END");
    
        return driversWithPenalties;
    }

    @Operation(summary = "Save penalties", tags = Constants.TAG_PENALTY)
    @PutMapping(path = "/save", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> savePenalty(@RequestBody List<PenaltyDTO> penaltyDTOs, @RequestParam(value = "season", required = false) Integer season) {
        Log.info("START - savePenalty - START");        
        Log.info("RequestBody savePenalty " + penaltyDTOs.toString());
        Log.info("RequestParam savePenalty (season) " + season);

        try {
            int numberSeason = season == null ? Constants.ACTUAL_SEASON : season;
            Penalty firstPenalty = penaltyMapper.penaltyDTOToPenalty(penaltyDTOs.get(0));
            List<Penalty> existingPenalties = penaltyRepository.findByDriverAndRaceAndSeverity(firstPenalty.getDriver().getId(), firstPenalty.getRace().getId(), firstPenalty.getSeverity().getId(), numberSeason);
           
            List<Season> seasons = this.seasonRepository.findByNumber(numberSeason);
            if (seasons.isEmpty()) return new ResponseEntity<>(Constants.ERROR_SEASON, Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(500));
            SeasonDTO seasonToSave = this.seasonMapper.seasonToSeasonDTO(seasons.get(0));
            penaltyDTOs.forEach((PenaltyDTO penaltyDTO) -> penaltyDTO.setSeason(seasonToSave));

            penaltyRepository.deleteAll(existingPenalties);
            penaltyService.savePenalties(penaltyDTOs);
        } catch (Exception e) {
            Log.error(Constants.ERROR_UNEXPECTED, e);
            return new ResponseEntity<>(Constants.ERROR_GENERIC, Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(500));
        }
        
        Log.info("END - penaltySave - END");        
        
        return new ResponseEntity<>("Penalización guardada correctamente", Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(200));
    }

    @Operation(summary = "Get a penalty for a driver and circuit", tags = Constants.TAG_PENALTY)
    @GetMapping("/perDriverPerRace")
    public List<PenaltyDTO> getPenaltyByDriverAndRace(@RequestParam("driverId") Integer driverId, @RequestParam("raceId") Integer raceId, @RequestParam("severityId") Integer severityId, @RequestParam(value = "season", required = false) Integer season) {
        Log.info("START - getPenaltyByDriverAndRace - START");
        Log.info("RequestParam getPenaltyByDriverAndRace (driverId) -> " + driverId);
        Log.info("RequestParam getPenaltyByDriverAndRace (raceId) -> " + raceId);
        Log.info("RequestParam getPenaltyByDriverAndRace (severityId) -> " + severityId);
        Log.info("RequestParam getPenaltyByDriverAndRace (season) -> " + season);

        int numberSeason = season == null ? Constants.ACTUAL_SEASON : season;
        List<PenaltyDTO> penaltyDTOs = new ArrayList<>();
        List<Penalty> penaltiesDriver = penaltyRepository.findByDriverAndRaceAndSeverity((long) driverId, (long) raceId, (long) severityId, numberSeason);

        if (penaltiesDriver.isEmpty()) return penaltyDTOs;
        penaltyDTOs = penaltyMapper.convertPenaltiesToPenaltiesDTO(penaltiesDriver);

        Log.info("END - getPenaltyByDriverAndRace - END");

        return penaltyDTOs;
    }
}