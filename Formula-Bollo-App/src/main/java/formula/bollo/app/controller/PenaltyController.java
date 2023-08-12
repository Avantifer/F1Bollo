package formula.bollo.app.controller;

import formula.bollo.app.entity.Driver;
import formula.bollo.app.entity.Penalty;
import formula.bollo.app.entity.Race;
import formula.bollo.app.mapper.DriverMapper;
import formula.bollo.app.mapper.PenaltyMapper;
import formula.bollo.app.mapper.RaceMapper;
import formula.bollo.app.model.DriverDTO;
import formula.bollo.app.model.DriverPenaltiesDTO;
import formula.bollo.app.model.PenaltyDTO;
import formula.bollo.app.model.RacePenaltiesDTO;
import formula.bollo.app.repository.PenaltyRepository;
import formula.bollo.app.repository.RaceRepository;
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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "https://formulabollo.es")
@RestController
@RequestMapping(path = {"/penalties"}, produces = MediaType.APPLICATION_JSON_VALUE)
public class PenaltyController {

    @Autowired
    private PenaltyRepository penaltyRepository;

    @Autowired
    private PenaltyMapper penaltyMapper;

    @Autowired
    private RaceRepository raceRepository;

    @Autowired
    private DriverMapper driverMapper;

    @Autowired
    private RaceMapper raceMapper;


    @Operation(summary = "Get all penalties")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Penalties successfully obtained"),
        @ApiResponse(code = 404, message = "Penalties cannot be found"),
        @ApiResponse(code = 500, message = "There was an error, contact with administrator")
    })
    @GetMapping("/all")
    public List<PenaltyDTO> getAllPenalties() {
        Log.info("START - getAllPenalties - START");
        
        List<Penalty> penalties = penaltyRepository.findAll();
        List<PenaltyDTO> penaltyDTOs = new ArrayList<>();
        
        for (Penalty penalty : penalties) {
            penaltyDTOs.add(penaltyMapper.penaltyToPenaltyDTO(penalty));
        }
        
        Log.info("END - getAllPenalties - END");

        return penaltyDTOs;
    }

    @Operation(summary = "Get penalties per circuit")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Penalties successfully obtained"),
        @ApiResponse(code = 404, message = "Penalties cannot be found"),
        @ApiResponse(code = 500, message = "There was an error, contact with administrator")
    })
    @GetMapping("/circuit")
    public List<PenaltyDTO> getPenaltiesByCircuit(@RequestParam("circuitId") Integer circuitId) {
        Log.info("START - getPenaltiesByCircuit - START");
        Log.info("RequestParam getPenaltiesByCircuit (circuitId) -> " + circuitId);

        List<PenaltyDTO> penaltyDTOs = new ArrayList<>();
        List<Race> races = raceRepository.findByCircuitId((long)circuitId);

        if (races.isEmpty()) {
            return penaltyDTOs;
        }

        List<Penalty> penalties = penaltyRepository.findByRaceId(races.get(0).getId());

        for(Penalty penalty : penalties) {
            penaltyDTOs.add(penaltyMapper.penaltyToPenaltyDTO(penalty));
        }

        Log.info("END - getPenaltiesByCircuit - END");

        return penaltyDTOs;
    }

    @Operation(summary = "Get penalties per driver")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Penalties successfully obtained"),
        @ApiResponse(code = 404, message = "Penalties cannot be found"),
        @ApiResponse(code = 500, message = "There was an error, contact with administrator")
    })
    @GetMapping("/totalPerDriver")
    public List<DriverPenaltiesDTO> getPenaltiesByDriverAndRace() {
        Log.info("START - getPenaltiesByDriverAndRace - START");
    
        List<DriverPenaltiesDTO> driversWithPenalties = new ArrayList<>();
        List<Penalty> penalties = penaltyRepository.findAll();
        Map<Driver, Map<Race, List<Penalty>>> driverRacePenaltiesMap = new HashMap<>();
    
        // Create a map of drivers, races, and their penalties
        for (Penalty penalty : penalties) {
            Driver driver = penalty.getDriver();
            Race race = penalty.getRace();
    
            Map<Race, List<Penalty>> racePenaltiesMap = driverRacePenaltiesMap.getOrDefault(driver, new HashMap<>());
            List<Penalty> penaltiesList = racePenaltiesMap.getOrDefault(race, new ArrayList<>());
            penaltiesList.add(penalty);
            racePenaltiesMap.put(race, penaltiesList);
            driverRacePenaltiesMap.put(driver, racePenaltiesMap);
        }
    
        // Create a list of drivers with their penalties for each race
        for (Map.Entry<Driver, Map<Race, List<Penalty>>> driverEntry : driverRacePenaltiesMap.entrySet()) {
            Driver driver = driverEntry.getKey();
            DriverDTO driverDTO = driverMapper.driverToDriverDTONoImage(driver);
            List<RacePenaltiesDTO> racePenaltiesDTOs = new ArrayList<>();
    
            for (Map.Entry<Race, List<Penalty>> raceEntry : driverEntry.getValue().entrySet()) {
                Race race = raceEntry.getKey();
                List<Penalty> penaltiesList = raceEntry.getValue();
                List<PenaltyDTO> penaltyDTOs = new ArrayList<>();
    
                // Convert penalties to DTOs
                for (Penalty penalty : penaltiesList) {
                    PenaltyDTO penaltyDTO = penaltyMapper.penaltyToPenaltyDTO(penalty);
                    penaltyDTOs.add(penaltyDTO);
                }
    
                // Create a DTO object for each race with its penalties
                RacePenaltiesDTO racePenaltiesDTO = new RacePenaltiesDTO();
                racePenaltiesDTO.setRace(raceMapper.raceToRaceDTO(race));
                racePenaltiesDTO.setPenalties(penaltyDTOs);
                racePenaltiesDTOs.add(racePenaltiesDTO);
            }
    
            // Create a DTO object for driver with their penalties for each race
            DriverPenaltiesDTO driverPenaltiesDTO = new DriverPenaltiesDTO();
            driverPenaltiesDTO.setDriver(driverDTO);
            driverPenaltiesDTO.setRacePenalties(racePenaltiesDTOs);
    
            driversWithPenalties.add(driverPenaltiesDTO);
        }
    
        Comparator<DriverPenaltiesDTO> driverComparator = Comparator.comparingLong(dto -> dto.getDriver().getId());
        Collections.sort(driversWithPenalties, driverComparator);
    
        Log.info("END - getPenaltiesByDriverAndRace - END");
    
        return driversWithPenalties;
    }

    @Operation(summary = "Save penalties")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Penalties successfully saved"),
        @ApiResponse(code = 404, message = "Penalties cannot be found"),
        @ApiResponse(code = 500, message = "There was an error, contact with administrator")
    })
    @PutMapping("/save")
    public ResponseEntity<String> savePenalty(@RequestBody List<PenaltyDTO> penaltyDTOs) {
        Log.info("START - savePenalty - START");        
        Log.info("RequestBody savePenalty " + penaltyDTOs.toString());

        try {
            Penalty firstPenalty = penaltyMapper.penaltyDTOToPenalty(penaltyDTOs.get(0));
            List<Penalty> existingPenalties = penaltyRepository.findByDriverAndRaceAndSeverity(firstPenalty.getDriver().getId(), firstPenalty.getRace().getId(), firstPenalty.getSeverity().getId());
            
            penaltyRepository.deleteAll(existingPenalties);

            for(PenaltyDTO penaltyDTO : penaltyDTOs) {
                Penalty penalty = penaltyMapper.penaltyDTOToPenalty(penaltyDTO);
                if (!penalty.getReason().isEmpty()) {
                    penaltyRepository.save(penalty);
                }
            }

        } catch (DataAccessException e) {
            Log.error("Error inesperado", e);
            return new ResponseEntity<>("Hubo un problema con la base de datos", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            Log.error("Error inesperado", e);
            return new ResponseEntity<>("Error inesperado. Contacta con el administrados", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
        Log.info("END - penaltySave - END");        
        
        return new ResponseEntity<>("Penalización guardada correctamente", HttpStatus.OK);
    }

    @Operation(summary = "Get a penalty for a driver and circuit")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Penalty successfully obtained"),
        @ApiResponse(code = 404, message = "Penalty cannot be found"),
        @ApiResponse(code = 500, message = "There was an error, contact with administrator")
    })
    @GetMapping("/perDriverPerRace")
    public List<PenaltyDTO> getPenaltyByDriverAndRace(@RequestParam("driverId") Integer driverId, @RequestParam("raceId") Integer raceId, @RequestParam("severityId") Integer severityId) {
        Log.info("START - getPenaltyByDriverAndRace - START");
        Log.info("RequestParam getPenaltyByDriverAndRace (driverId) -> " + driverId);
        Log.info("RequestParam getPenaltyByDriverAndRace (raceId) -> " + raceId);
        Log.info("RequestParam getPenaltyByDriverAndRace (severityId) -> " + severityId);

        List<PenaltyDTO> penaltyDTOs = new ArrayList<>();

        List<Penalty> penaltyDriver = penaltyRepository.findByDriverAndRaceAndSeverity((long) driverId, (long) raceId, (long) severityId);

        if (!penaltyDriver.isEmpty()) {
            for (Penalty penalty : penaltyDriver) {
                penaltyDTOs.add(penaltyMapper.penaltyToPenaltyDTO(penalty));
            }
        }

        Log.info("END - getPenaltyByDriverAndRace - END");

        return penaltyDTOs;
    }
}