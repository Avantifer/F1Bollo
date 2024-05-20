package formula.bollo.app.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import formula.bollo.app.entity.FantasyElection;
import formula.bollo.app.entity.FantasyPointsDriver;
import formula.bollo.app.entity.FantasyPointsTeam;
import formula.bollo.app.entity.FantasyPriceDriver;
import formula.bollo.app.entity.FantasyPriceTeam;
import formula.bollo.app.entity.Race;
import formula.bollo.app.entity.Result;
import formula.bollo.app.mapper.FantasyElectionMapper;
import formula.bollo.app.mapper.FantasyPointsMapper;
import formula.bollo.app.mapper.FantasyPriceMapper;
import formula.bollo.app.model.FantasyElectionDTO;
import formula.bollo.app.model.FantasyInfoDTO;
import formula.bollo.app.model.FantasyPointsDriverDTO;
import formula.bollo.app.model.FantasyPointsTeamDTO;
import formula.bollo.app.model.FantasyPointsUserDTO;
import formula.bollo.app.model.FantasyPriceDriverDTO;
import formula.bollo.app.model.FantasyPriceTeamDTO;
import formula.bollo.app.repository.FantasyElectionRepository;
import formula.bollo.app.repository.FantasyPointsDriverRepository;
import formula.bollo.app.repository.FantasyPointsTeamRepository;
import formula.bollo.app.repository.FantasyPriceDriverRepository;
import formula.bollo.app.repository.FantasyPriceTeamRepository;
import formula.bollo.app.repository.RaceRepository;
import formula.bollo.app.repository.ResultRepository;
import formula.bollo.app.services.FantasyService;
import formula.bollo.app.utils.Constants;
import formula.bollo.app.utils.Log;

@CrossOrigin(origins = Constants.PRODUCTION_FRONTEND)
@RestController
@RequestMapping(path = {Constants.ENDPOINT_FANTASY}, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = Constants.TAG_FANTASY, description = Constants.TAG_FANTASY_SUMMARY)
public class FantasyController {

    private FantasyService fantasyService;
    private ResultRepository resultRepository;
    private RaceRepository raceRepository;
    private FantasyPointsDriverRepository fantasyPointsDriverRepository;
    private FantasyPriceDriverRepository fantasyPriceDriverRepository;
    private FantasyPriceTeamRepository fantasyPriceTeamRepository;
    private FantasyPointsTeamRepository fantasyPointsTeamRepository;
    private FantasyElectionRepository fantasyElectionRepository;
    private FantasyPriceMapper fantasyPriceMapper;
    private FantasyPointsMapper fantasyPointsMapper;
    private FantasyElectionMapper fantasyElectionMapper;

    public FantasyController(
        FantasyService fantasyService,
        ResultRepository resultRepository,
        FantasyPointsDriverRepository fantasyPointsDriverRepository,
        FantasyPriceDriverRepository fantasyPriceDriverRepository,
        FantasyPriceTeamRepository fantasyPriceTeamRepository,
        FantasyPointsTeamRepository fantasyPointsTeamRepository,
        FantasyElectionRepository fantasyElectionRepository,
        RaceRepository raceRepository,
        FantasyPriceMapper fantasyPriceMapper,
        FantasyPointsMapper fantasyPointsMapper,
        FantasyElectionMapper fantasyElectionMapper
    ) {
        this.fantasyService = fantasyService;
        this.resultRepository = resultRepository;
        this.fantasyPointsDriverRepository = fantasyPointsDriverRepository;
        this.fantasyPriceDriverRepository = fantasyPriceDriverRepository;
        this.fantasyPriceTeamRepository = fantasyPriceTeamRepository;
        this.fantasyPointsTeamRepository = fantasyPointsTeamRepository;
        this.fantasyElectionRepository = fantasyElectionRepository;
        this.raceRepository = raceRepository;
        this.fantasyPriceMapper = fantasyPriceMapper;
        this.fantasyPointsMapper = fantasyPointsMapper;
        this.fantasyElectionMapper = fantasyElectionMapper;
    }
    
    @Operation(summary = "Save driver's and team's points", tags = Constants.TAG_FANTASY)
    @PutMapping("/saveDriverTeamPoints")
    public ResponseEntity<String> saveDriverTeamPoints(@RequestParam(name = "raceId", required = true) Integer raceId) {
        Log.info("START - saveDriverTeamPoints - START");
        Log.info("RequestParam saveDriverTeamPoints (raceId) -> " + raceId);
        
        List<Result> results = this.resultRepository.findByRaceId(raceId.longValue());
        
        List<FantasyPointsDriver> fantasyDriversPrevious = this.fantasyPointsDriverRepository.findByRaceId(Constants.ACTUAL_SEASON, (long) raceId);
        List<FantasyPointsDriver> fantasyPointsDriver = this.fantasyService.createDriversPoints(results);
        if (fantasyPointsDriver.isEmpty()) return new ResponseEntity<>("Hubo un problema con los puntos. Contacte con el administrador", Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(500));
        
        fantasyPointsDriverRepository.deleteAll(fantasyDriversPrevious);
        fantasyPointsDriverRepository.saveAll(fantasyPointsDriver);
        
        List<FantasyPointsTeam> fantasyPointsTeams = this.fantasyService.createTeamsPoints(fantasyPointsDriver);
        List<FantasyPointsTeam> fantasyTeamsPrevious = this.fantasyPointsTeamRepository.findByRaceId(Constants.ACTUAL_SEASON, (long) raceId);
        
        fantasyPointsTeamRepository.deleteAll(fantasyTeamsPrevious);
        fantasyPointsTeamRepository.saveAll(fantasyPointsTeams);

        Log.info("END - saveDriverTeamPoints - END");
        
        return new ResponseEntity<>("Puntos guardados correctamente", Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(200));
    }

    @Operation(summary = "Get driver's points", tags = Constants.TAG_FANTASY)
    @GetMapping("/allDriverPoints")
    public List<FantasyPointsDriverDTO> getAllDriverPoints(@RequestParam(name = "raceId", required = true) Integer raceId) {
        Log.info("START - getAllDriverPoints - START");
        Log.info("RequestParam getAllDriverPoints (raceId) -> " + raceId);

        List<FantasyPointsDriverDTO> fantasyPointsDriverDTOs;
        List<FantasyPointsDriver> fantasyPointsDrivers = this.fantasyPointsDriverRepository.findByRaceId(Constants.ACTUAL_SEASON, (long) raceId);
        fantasyPointsDriverDTOs = this.fantasyPointsMapper.convertFantasyPointsDriverToFantasyPointsDriverDTO(fantasyPointsDrivers);
    
        Log.info("END - getAllDriverPoints - END");
        
        return fantasyPointsDriverDTOs;
    }

    @Operation(summary = "Get fantasy points of a driver", tags = Constants.TAG_FANTASY)
    @GetMapping("/driverPointsSpecificRace")
    public FantasyPointsDriverDTO getDriverPointsSpecificRace(@RequestParam Integer driverId, @RequestParam Integer raceId) {
        Log.info("START - getDriverPointsSpecificRace - START");
        Log.info("RequestParam getDriverPointsSpecificRace (driverId) -> " + driverId);
        Log.info("RequestParam getDriverPointsSpecificRace (raceId) -> " + raceId);

        Optional<FantasyPointsDriver> fantasyPointsDriver = this.fantasyPointsDriverRepository.findByDriverIdAndRaceId(Constants.ACTUAL_SEASON,(long) driverId,(long) raceId);
        if (!fantasyPointsDriver.isPresent()) return null;

        FantasyPointsDriverDTO fantasyPointsDriverDTO = this.fantasyPointsMapper.fantasyPointsDriverToFantasyPointsDriverDTO(fantasyPointsDriver.get());
        Log.info("END - getDriverPointsSpecificRace - END");
        return fantasyPointsDriverDTO;
    }

    @Operation(summary = "Get team's points", tags = Constants.TAG_FANTASY)
    @GetMapping("/allTeamPoints")
    public List<FantasyPointsTeamDTO> getAllTeamPoints(@RequestParam(name = "raceId", required = true) Integer raceId) {
        Log.info("START - getAllTeamPoints - START");
        Log.info("RequestParam getAllTeamPoints (raceId) -> " + raceId);

        List<FantasyPointsTeamDTO> fantasyPointsTeamDTOs;
        List<FantasyPointsTeam> fantasyPriceTeams = this.fantasyPointsTeamRepository.findByRaceId(Constants.ACTUAL_SEASON, (long) raceId);
        fantasyPointsTeamDTOs = this.fantasyPointsMapper.convertFantasyPointsTeamToFantasyPointsTeamDTO(fantasyPriceTeams);
    
        Log.info("END - getAllTeamPoints - END");
        
        return fantasyPointsTeamDTOs;
    }

    @Operation(summary = "Get fantasy points of a team", tags = Constants.TAG_FANTASY)
    @GetMapping("/teamsPointsSpecificRace")
    public FantasyPointsTeamDTO teamsPointsSpecificRace(@RequestParam Integer teamId, @RequestParam Integer raceId) {
        Log.info("START - teamsPointsSpecificRace - START");
        Log.info("RequestParam teamsPointsSpecificRace (teamId) -> " + teamId);
        Log.info("RequestParam teamsPointsSpecificRace (raceId) -> " + raceId);

        Optional<FantasyPointsTeam> fantasyPointsTeam = this.fantasyPointsTeamRepository.findByTeamIdAndRaceId(Constants.ACTUAL_SEASON,(long) teamId,(long) raceId);
        if (!fantasyPointsTeam.isPresent()) return null;

        FantasyPointsTeamDTO fantasyPointsTeamDTO = this.fantasyPointsMapper.fantasyPointsTeamToFantasyPointsTeamDTO(fantasyPointsTeam.get());
        Log.info("END - teamsPointsSpecificRace - END");
        return fantasyPointsTeamDTO;
    }

    @Operation(summary = "Save driver's and team's prices", tags = Constants.TAG_FANTASY)
    @PutMapping("/saveDriverTeamPrices")
    public ResponseEntity<String> saveDriverTeamPrices(@RequestParam(name = "raceId", required = true) Integer raceId) {
        Log.info("START - saveDriverTeamPrices - START");
        Log.info("RequestParam saveDriverTeamPrices (raceId) -> " + raceId);
        
        List<Result> results = this.resultRepository.findByRaceId((long) raceId);

        Optional<Race> nextRace = this.raceRepository.findById(raceId.longValue() + 1);

        if (!nextRace.isPresent()) {
            Log.info("No se ha encontrado la siguiente carrera con el id -> " + raceId + 1);
            return new ResponseEntity<>("No se ha encontrado la siguiente carrera", Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(404));
        }
        
        List<FantasyPriceDriver> fantasyDriversPrevious = this.fantasyPriceDriverRepository.findByRaceId(raceId.longValue() + 1);
        List<FantasyPriceDriver> fantasyPricesDriver = this.fantasyService.createDriversPrices(results, nextRace.get());
        if (fantasyPricesDriver.isEmpty()) return new ResponseEntity<>("Hubo un problema con los precios. Contacte con el administrador", Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(500));
        
        fantasyPriceDriverRepository.deleteAll(fantasyDriversPrevious);
        fantasyPriceDriverRepository.saveAll(fantasyPricesDriver);
    
        List<FantasyPriceTeam> fantasyTeamPrevious = this.fantasyPriceTeamRepository.findByRaceId(raceId.longValue() + 1);
        List<FantasyPriceTeam> fantasyPricesTeam = this.fantasyService.createTeamsPrices(fantasyPricesDriver, nextRace.get());
        
        fantasyPriceTeamRepository.deleteAll(fantasyTeamPrevious);
        fantasyPriceTeamRepository.saveAll(fantasyPricesTeam);

        Log.info("END - saveDriverTeamPrices - END");
        
        return new ResponseEntity<>("Precios guardados correctamente", Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(200));
    }

    @Operation(summary = "Get all drivers' prices", tags = Constants.TAG_FANTASY)
    @GetMapping("/allDriverPrices")
    public List<FantasyPriceDriverDTO> getAllDriverPrices(@RequestParam(name = "raceId", required = true) Integer raceId) {
        Log.info("START - getAllDriverPrices - START");
        Log.info("RequestParam getAllDriverPrices (raceId) -> " + raceId);

        List<FantasyPriceDriverDTO> fantasyPriceDriverDTOs;
        List<FantasyPriceDriver> fantasyPriceDrivers = this.fantasyPriceDriverRepository.findByRaceId((long) raceId);
        fantasyPriceDriverDTOs = this.fantasyPriceMapper.convertFantasyPriceDriverToFantasyPriceDriverDTO(fantasyPriceDrivers);

        Log.info("END - getAllDriverPrices - END");
        
        return fantasyPriceDriverDTOs;
    }

    @Operation(summary = "Get teams' prices", tags = Constants.TAG_FANTASY)
    @GetMapping("/allTeamPrices")
    public List<FantasyPriceTeamDTO> getAllTeamPrices(@RequestParam(name = "raceId", required = true) Integer raceId) {
        Log.info("START - getAllTeamPrices - START");
        Log.info("RequestParam getAllTeamPrices (raceId) -> " + raceId);

        List<FantasyPriceTeamDTO> fantasyPriceTeamDTOs;
        List<FantasyPriceTeam> fantasyPriceTeams = this.fantasyPriceTeamRepository.findByRaceId((long) raceId);
        fantasyPriceTeamDTOs = this.fantasyPriceMapper.convertFantasyPriceTeamToFantasyPriceTeamDTO(fantasyPriceTeams);
        
        Log.info("END - getAllTeamPrices - END");
        
        return fantasyPriceTeamDTOs;
    }

    @Operation(summary = "Get a driver info", tags = Constants.TAG_FANTASY)
    @GetMapping("/getInfoByDriver")
    public FantasyInfoDTO getInfoByDriver(@RequestParam int driverId) {
        Log.info("START - getInfoByDriver - START");
        Log.info("RequestParam getInfoByDriver (driverId) -> " + driverId);
        
        FantasyInfoDTO fantasyInfoDTO = new FantasyInfoDTO();

        int totalPoints = 0;
        List<FantasyPointsDriver> fantasyPointsDriver = this.fantasyPointsDriverRepository.findByDriverId((long) driverId);
        
        if (!fantasyPointsDriver.isEmpty()) {
            for(FantasyPointsDriver driver : fantasyPointsDriver) {
                totalPoints += driver.getPoints();
            }
        }
        fantasyInfoDTO.setTotalPoints(totalPoints);

        List<FantasyPriceDriver> fantasyPriceDriver = this.fantasyPriceDriverRepository.findTwoLastPrices((long) driverId);
        if (fantasyPriceDriver.size() < 2) return fantasyInfoDTO;

        double price1 = fantasyPriceDriver.get(0).getPrice();
        double price2 = fantasyPriceDriver.get(1).getPrice();
        double difference = price2 - price1;
        double percentage = ((difference / price2) * 100) * -1;

        fantasyInfoDTO.setDifferencePrice(percentage);
        Log.info("END - getInfoByDriver - END");
        return fantasyInfoDTO;
    }
    
    @Operation(summary = "Get a team info", tags = Constants.TAG_FANTASY)
    @GetMapping("/getInfoByTeam")
    public FantasyInfoDTO getInfoByTeam(@RequestParam int teamId) {
        Log.info("START - getInfoByTeam - START");
        Log.info("RequestParam getInfoByTeam (driverId) -> " + teamId);
        
        FantasyInfoDTO fantasyInfoDTO = new FantasyInfoDTO();

        int totalPoints = 0;
        List<FantasyPointsTeam> fantasyPointsTeam = this.fantasyPointsTeamRepository.findByTeamId((long) teamId);
        
        if (!fantasyPointsTeam.isEmpty()) {
            for(FantasyPointsTeam driver : fantasyPointsTeam) {
                totalPoints += driver.getPoints();
            }
        }
        fantasyInfoDTO.setTotalPoints(totalPoints);

        List<FantasyPriceTeam> fantasyPriceTeam = this.fantasyPriceTeamRepository.findTwoLastPrices((long) teamId);
        if (fantasyPriceTeam.size() < 2) return fantasyInfoDTO;
        
        double price1 = fantasyPriceTeam.get(0).getPrice();
        double price2 = fantasyPriceTeam.get(1).getPrice();
        double difference = price2 - price1;
        double percentage = ((difference / price2) * 100) * -1;

        fantasyInfoDTO.setDifferencePrice(percentage);
        Log.info("END - getInfoByTeam - END");
        return fantasyInfoDTO;
    }

    @Operation(summary = "Save fantasy Election", tags = Constants.TAG_FANTASY)
    @PostMapping(path = "/saveFantasyElection", produces = MediaType.TEXT_PLAIN_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveFantasyElection(@RequestBody FantasyElectionDTO fantasyElectionDTO) {
        Log.info("START - saveFantasyElection - START");
        Log.info("RequestBody fantasyElection " + fantasyElectionDTO.toString());
        
        FantasyElection fantasyElection = this.fantasyElectionMapper.fantasyElectionDTOToFantasyElection(fantasyElectionDTO);
        Optional<FantasyElection> fantasyElectionPrevious = this.fantasyElectionRepository.findBySeasonUserIdAndRaceId(
                fantasyElectionDTO.getSeason().getNumber(),
                fantasyElectionDTO.getUser().getId(),
                fantasyElectionDTO.getRace().getId());

        if (fantasyElectionPrevious.isPresent()) {
            fantasyElection.setId(fantasyElectionPrevious.get().getId());
            this.fantasyElectionRepository.save(fantasyElection);
        } else {
            this.fantasyElectionRepository.save(fantasyElection);
        }


        Log.info("END - saveFantasyElection - END");
        return new ResponseEntity<>("Tu equipo ha sido guardado correctamente", Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(200));
    }

    @Operation(summary = "Get fantasy election", tags = Constants.TAG_FANTASY)
    @GetMapping("/getFantasyElection")
    public FantasyElectionDTO getFantasyElection(@RequestParam int raceId, @RequestParam int userId) {
        Log.info("START - getFantasyElection - START");
        Log.info("RequestParam getFantasyElection (raceId) -> " + raceId);
        Log.info("RequestParam getFantasyElection (userId) -> " + userId);
        
        Optional<FantasyElection> fantasyElection = this.fantasyElectionRepository.findBySeasonUserIdAndRaceId(Constants.ACTUAL_SEASON, (long) userId, (long) raceId);
        if (fantasyElection.isEmpty()) return null;
        
        FantasyElectionDTO fantasyElectionDTO = this.fantasyElectionMapper.fantasyElectionToFantasyElectionDTO(fantasyElection.get());

        Log.info("END - getFantasyElection - END");
        return fantasyElectionDTO;
    }

    @Operation(summary = "Get fantasy points of user", tags = Constants.TAG_FANTASY)
    @GetMapping("/getFantasyPoints")
    public List<FantasyPointsUserDTO> getFantasyPoints(@RequestParam Integer raceId, @RequestParam(value = "season", required = false) Integer season) {
        Log.info("START - getFantasyPoints - START");
        Log.info("RequestParam getFantasyPoints (raceId) -> " + raceId);
        Log.info("RequestParam getFantasyPoints (season) -> " + season);

        int numberSeason = season == null ? Constants.ACTUAL_SEASON : season;
        List<FantasyPointsUserDTO> fantasyPointsUserDTOs;

        if (raceId != 0) {
            fantasyPointsUserDTOs = this.fantasyService.getFantasyPoints(raceId);
        } else {
            fantasyPointsUserDTOs = this.fantasyService.sumAllFantasyPoints(numberSeason);
        }
        
        Log.info("END - getFantasyPoints - END");
        return fantasyPointsUserDTOs;
    }

    @Operation(summary = "Get driver's prices", tags = Constants.TAG_FANTASY)
    @GetMapping("/driverPrice")
    public List<FantasyPriceDriverDTO> getDriverPrices(@RequestParam(name = "driverId", required = true) Integer driverId) {
        Log.info("START - getDriverPrices - START");
        Log.info("RequestParam getDriverPrices (driverId) -> " + driverId);

        List<FantasyPriceDriver> fantasyPriceDrivers = this.fantasyPriceDriverRepository.findByDriverId((long) driverId);
        List<FantasyPriceDriverDTO> fantasyPriceDriverDTOs = this.fantasyPriceMapper.convertFantasyPriceDriverToFantasyPriceDriverDTO(fantasyPriceDrivers);

        Log.info("END - getDriverPrices - END");
        
        return fantasyPriceDriverDTOs;
    }

    @Operation(summary = "Get team's prices", tags = Constants.TAG_FANTASY)
    @GetMapping("/teamPrice")
    public List<FantasyPriceTeamDTO> getTeamPrice(@RequestParam(name = "teamId", required = true) Integer teamId) {
        Log.info("START - getTeamPrice - START");
        Log.info("RequestParam getTeamPrice (teamId) -> " + teamId);

        List<FantasyPriceTeam> fantasyPriceTeam = this.fantasyPriceTeamRepository.findByTeamId((long) teamId);
        List<FantasyPriceTeamDTO> fantasyPriceTeamDTOs = this.fantasyPriceMapper.convertFantasyPriceTeamToFantasyPriceTeamDTO(fantasyPriceTeam);

        Log.info("END - getTeamPrice - END");
        
        return fantasyPriceTeamDTOs;
    }

    @Operation(summary = "Get driver's points", tags = Constants.TAG_FANTASY)
    @GetMapping("/driverPoints")
    public List<FantasyPointsDriverDTO> getDriverPoints(@RequestParam(name = "driverId", required = true) Integer driverId) {
        Log.info("START - getDriverPoints - START");
        Log.info("RequestParam getDriverPoints (driverId) -> " + driverId);

        List<FantasyPointsDriver> fantasyPointsDriver = this.fantasyPointsDriverRepository.findByDriverId((long) driverId);
        List<FantasyPointsDriverDTO> fantasyPointsDriverDTOs = this.fantasyPointsMapper.convertFantasyPointsDriverToFantasyPointsDriverDTO(fantasyPointsDriver);

        Log.info("END - getDriverPoints - END");
        
        return fantasyPointsDriverDTOs;
    }

    @Operation(summary = "Get team's points", tags = Constants.TAG_FANTASY)
    @GetMapping("/teamPoints")
    public List<FantasyPointsTeamDTO> getTeamPoints(@RequestParam(name = "teamId", required = true) Integer teamId) {
        Log.info("START - getTeamPoints - START");
        Log.info("RequestParam getTeamPoints (teamId) -> " + teamId);

        List<FantasyPointsTeam> fantasyPointsTeam = this.fantasyPointsTeamRepository.findByTeamId((long) teamId);
        List<FantasyPointsTeamDTO> fantasyPointsTeamDTOs = this.fantasyPointsMapper.convertFantasyPointsTeamToFantasyPointsTeamDTO(fantasyPointsTeam);

        Log.info("END - getTeamPoints - END");
        
        return fantasyPointsTeamDTOs;
    }
}
