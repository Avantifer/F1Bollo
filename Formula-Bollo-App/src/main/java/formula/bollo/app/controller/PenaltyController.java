package formula.bollo.app.controller;

import formula.bollo.app.entity.Driver;
import formula.bollo.app.entity.Penalty;
import formula.bollo.app.entity.Race;
import formula.bollo.app.mapper.PenaltyMapper;
import formula.bollo.app.model.DriverPenaltiesDTO;
import formula.bollo.app.model.PenaltyDTO;
import formula.bollo.app.repository.PenaltyRepository;
import formula.bollo.app.repository.RaceRepository;
import formula.bollo.app.services.PenaltyService;
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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = Constants.URL_FRONTED)
@RestController
@RequestMapping(path = {Constants.ENDPOINT_PENALTY}, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = Constants.TAG_PENALTY, description = Constants.TAG_PENALTY_SUMMARY)
public class PenaltyController {

    @Autowired
    private PenaltyRepository penaltyRepository;

    @Autowired
    private RaceRepository raceRepository;

    @Autowired
    private PenaltyMapper penaltyMapper;

    @Autowired
    private PenaltyService penaltyService;

    @Operation(summary = "Get all penalties", tags = Constants.TAG_PENALTY)
    @GetMapping("/all")
    public List<PenaltyDTO> getAllPenalties() {
        Log.info("START - getAllPenalties - START");
        
        List<Penalty> penalties = penaltyRepository.findAll();
        List<PenaltyDTO> penaltyDTOs = new ArrayList<>();

        if (penalties.isEmpty()) return penaltyDTOs;
        penaltyDTOs = penaltyMapper.convertPenaltiesToPenaltiesDTO(penalties);
        
        Log.info("END - getAllPenalties - END");

        return penaltyDTOs;
    }

    @Operation(summary = "Get penalties per circuit", tags = Constants.TAG_PENALTY)
    @GetMapping("/circuit")
    public List<PenaltyDTO> getPenaltiesByCircuit(@RequestParam("circuitId") Integer circuitId) {
        Log.info("START - getPenaltiesByCircuit - START");
        Log.info("RequestParam getPenaltiesByCircuit (circuitId) -> " + circuitId);

        List<Race> races = raceRepository.findByCircuitId((long) circuitId);
        List<PenaltyDTO> penaltyDTOs = new ArrayList<>();

        if (races.isEmpty()) return penaltyDTOs;
        List<Penalty> penalties = penaltyRepository.findByRaceId(races.get(0).getId());

        if (penalties.isEmpty()) return penaltyDTOs;
        penaltyDTOs = penaltyMapper.convertPenaltiesToPenaltiesDTO(penalties);

        Log.info("END - getPenaltiesByCircuit - END");

        return penaltyDTOs;
    }

    @Operation(summary = "Get penalties per driver", tags = Constants.TAG_PENALTY)
    @GetMapping("/totalPerDriver")
    public List<DriverPenaltiesDTO> getPenaltiesByDriverAndRace() {
        Log.info("START - getPenaltiesByDriverAndRace - START");
    
        List<DriverPenaltiesDTO> driversWithPenalties = new ArrayList<>();
        List<Penalty> penalties = penaltyRepository.findAll();

        if (penalties.isEmpty()) return driversWithPenalties;
        Map<Driver, Map<Race, List<Penalty>>> driverRacePenaltiesMap = new HashMap<>();

        penaltyService.addPenaltyToDriver(penalties, driverRacePenaltiesMap);
        driversWithPenalties = penaltyService.mapDriverRacePenalties(driverRacePenaltiesMap);
    
        Log.info("END - getPenaltiesByDriverAndRace - END");
    
        return driversWithPenalties;
    }

    @Operation(summary = "Save penalties", tags = Constants.TAG_PENALTY)
    @PutMapping(path = "/save", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> savePenalty(@RequestBody List<PenaltyDTO> penaltyDTOs) {
        Log.info("START - savePenalty - START");        
        Log.info("RequestBody savePenalty " + penaltyDTOs.toString());

        try {
            Penalty firstPenalty = penaltyMapper.penaltyDTOToPenalty(penaltyDTOs.get(0));
            List<Penalty> existingPenalties = penaltyRepository.findByDriverAndRaceAndSeverity(firstPenalty.getDriver().getId(), firstPenalty.getRace().getId(), firstPenalty.getSeverity().getId());
            penaltyRepository.deleteAll(existingPenalties);
            penaltyService.savePenalties(penaltyDTOs);
        } catch (DataAccessException e) {
            Log.error(Constants.ERROR_UNEXPECTED, e);
            return new ResponseEntity<>(Constants.ERROR_BBDD_GENERIC, Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(500));
        } catch (Exception e) {
            Log.error(Constants.ERROR_UNEXPECTED, e);
            return new ResponseEntity<>(Constants.ERROR_GENERIC, Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(500));
        }
        
        Log.info("END - penaltySave - END");        
        
        return new ResponseEntity<>("Penalización guardada correctamente", Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(200));
    }

    @Operation(summary = "Get a penalty for a driver and circuit", tags = Constants.TAG_PENALTY)
    @GetMapping("/perDriverPerRace")
    public List<PenaltyDTO> getPenaltyByDriverAndRace(@RequestParam("driverId") Integer driverId, @RequestParam("raceId") Integer raceId, @RequestParam("severityId") Integer severityId) {
        Log.info("START - getPenaltyByDriverAndRace - START");
        Log.info("RequestParam getPenaltyByDriverAndRace (driverId) -> " + driverId);
        Log.info("RequestParam getPenaltyByDriverAndRace (raceId) -> " + raceId);
        Log.info("RequestParam getPenaltyByDriverAndRace (severityId) -> " + severityId);

        List<PenaltyDTO> penaltyDTOs = new ArrayList<>();
        List<Penalty> penaltiesDriver = penaltyRepository.findByDriverAndRaceAndSeverity((long) driverId, (long) raceId, (long) severityId);

        if (penaltiesDriver.isEmpty()) return penaltyDTOs;
        penaltyDTOs = penaltyMapper.convertPenaltiesToPenaltiesDTO(penaltiesDriver);

        Log.info("END - getPenaltyByDriverAndRace - END");

        return penaltyDTOs;
    }
}