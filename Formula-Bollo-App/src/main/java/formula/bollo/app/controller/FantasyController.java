package formula.bollo.app.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import formula.bollo.app.entity.FantasyPointsDriver;
import formula.bollo.app.entity.FantasyPointsTeam;
import formula.bollo.app.entity.FantasyPriceDriver;
import formula.bollo.app.entity.FantasyPriceTeam;
import formula.bollo.app.entity.Race;
import formula.bollo.app.entity.Result;
import formula.bollo.app.mapper.FantasyPointsMapper;
import formula.bollo.app.mapper.FantasyPriceMapper;
import formula.bollo.app.model.FantasyDriverInfoDTO;
import formula.bollo.app.model.FantasyPointsDriverDTO;
import formula.bollo.app.model.FantasyPointsTeamDTO;
import formula.bollo.app.model.FantasyPriceDriverDTO;
import formula.bollo.app.model.FantasyPriceTeamDTO;
import formula.bollo.app.repository.FantasyPointsDriverRepository;
import formula.bollo.app.repository.FantasyPointsTeamRepository;
import formula.bollo.app.repository.FantasyPriceDriverRepository;
import formula.bollo.app.repository.FantasyPriceTeamRepository;
import formula.bollo.app.repository.RaceRepository;
import formula.bollo.app.repository.ResultRepository;
import formula.bollo.app.services.FantasyService;
import formula.bollo.app.utils.Constants;
import formula.bollo.app.utils.Log;

@CrossOrigin(origins = "http://192.168.1.135:4200")
@RestController
@RequestMapping(path = {Constants.ENDPOINT_FANTASY}, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = Constants.TAG_FANTASY, description = Constants.TAG_FANTASY_SUMMARY)
public class FantasyController {

    private ResultRepository resultRepository;
    private RaceRepository raceRepository;
    private FantasyService fantasyService;
    private FantasyPointsDriverRepository fantasyPointsDriverRepository;
    private FantasyPriceDriverRepository fantasyPriceDriverRepository;
    private FantasyPriceTeamRepository fantasyPriceTeamRepository;
    private FantasyPointsTeamRepository fantasyPointsTeamRepository;
    private FantasyPriceMapper fantasyPriceMapper;
    private FantasyPointsMapper fantasyPointsMapper;

    public FantasyController(
        ResultRepository resultRepository,
        FantasyService fantasyService,
        FantasyPointsDriverRepository fantasyPointsDriverRepository,
        FantasyPriceDriverRepository fantasyPriceDriverRepository,
        FantasyPriceTeamRepository fantasyPriceTeamRepository,
        FantasyPointsTeamRepository fantasyPointsTeamRepository,
        RaceRepository raceRepository,
        FantasyPriceMapper fantasyPriceMapper,
        FantasyPointsMapper fantasyPointsMapper
    ) {
        this.resultRepository = resultRepository;
        this.fantasyService = fantasyService;
        this.fantasyPointsDriverRepository = fantasyPointsDriverRepository;
        this.fantasyPriceDriverRepository = fantasyPriceDriverRepository;
        this.fantasyPriceTeamRepository = fantasyPriceTeamRepository;
        this.fantasyPointsTeamRepository = fantasyPointsTeamRepository;
        this.raceRepository = raceRepository;
        this.fantasyPriceMapper = fantasyPriceMapper;
        this.fantasyPointsMapper = fantasyPointsMapper;
    }
    
    @Operation(summary = "Save driver's and team's points", tags = Constants.TAG_FANTASY)
    @PutMapping("/saveDriverTeamPoints")
    public ResponseEntity<String> saveDriverTeamPoints(@RequestParam(name = "raceId", required = true) Integer raceId) {
        Log.info("START - saveDriverTeamPoints - START");
        Log.info("RequestParam saveDriverTeamPoints (raceId) -> " + raceId);
        
        List<Result> results = this.resultRepository.findByRaceId(raceId.longValue());
        
        List<FantasyPointsDriver> fantasyPointsDriver = this.fantasyService.createDriversPoints(results);
        if (fantasyPointsDriver.isEmpty()) return new ResponseEntity<>("Hubo un problema con los puntos. Contacte con el administrador", Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(500));
        fantasyPointsDriverRepository.saveAll(fantasyPointsDriver);

        List<FantasyPointsTeam> fantasyPointsTeams = this.fantasyService.createTeamsPoints(fantasyPointsDriver);
        if (fantasyPointsTeams.isEmpty()) return new ResponseEntity<>("Hubo un problema con los puntos. Contacte con el administrador", Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(500));
        fantasyPointsTeamRepository.saveAll(fantasyPointsTeams);

        Log.info("END - saveDriverTeamPoints - END");
        
        return new ResponseEntity<>("Puntos guardados correctamente", Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(200));
    }

    @Operation(summary = "Get driver's points", tags = Constants.TAG_FANTASY)
    @GetMapping("/allDriverPoints")
    public List<FantasyPointsDriverDTO> getDriverPoints(@RequestParam(name = "raceId", required = true) Integer raceId) {
        Log.info("START - getDriverPoints - START");
        Log.info("RequestParam getDriverPoints (raceId) -> " + raceId);

        List<FantasyPointsDriverDTO> fantasyPointsDriverDTOs = new ArrayList<>();
        List<FantasyPointsDriver> fantasyPriceDrivers = this.fantasyPointsDriverRepository.findByRaceId((long) raceId);
        fantasyPointsDriverDTOs = this.fantasyPointsMapper.convertFantasyPointsDriverToFantasyPointsDriverDTO(fantasyPriceDrivers);
    
        Log.info("END - getDriverPoints - END");
        
        return fantasyPointsDriverDTOs;
    }

    @Operation(summary = "Get team's points", tags = Constants.TAG_FANTASY)
    @GetMapping("/allTeamPoints")
    public List<FantasyPointsTeamDTO> getTeamPoints(@RequestParam(name = "raceId", required = true) Integer raceId) {
        Log.info("START - getTeamPoints - START");
        Log.info("RequestParam getTeamPoints (raceId) -> " + raceId);

        List<FantasyPointsTeamDTO> fantasyPointsTeamDTOs = new ArrayList<>();
        List<FantasyPointsTeam> fantasyPriceTeams = this.fantasyPointsTeamRepository.findByRaceId((long) raceId);
        fantasyPointsTeamDTOs = this.fantasyPointsMapper.convertFantasyPointsTeamToFantasyPointsTeamDTO(fantasyPriceTeams);
    
        Log.info("END - getTeamPoints - END");
        
        return fantasyPointsTeamDTOs;
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

        List<FantasyPriceDriver> fantasyPricesDriver = this.fantasyService.createDriversPrices(results, nextRace.get());
        if (fantasyPricesDriver.isEmpty()) return new ResponseEntity<>("Hubo un problema con los precios. Contacte con el administrador", Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(500));
        fantasyPriceDriverRepository.saveAll(fantasyPricesDriver);
    
        List<FantasyPriceTeam> fantasyPricesTeam = this.fantasyService.createTeamsPrices(fantasyPricesDriver, nextRace.get());
        if (fantasyPricesTeam.isEmpty()) return new ResponseEntity<>("Hubo un problema con los precios. Contacte con el administrador", Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(500));
        fantasyPriceTeamRepository.saveAll(fantasyPricesTeam);

        Log.info("END - saveDriverTeamPrices - END");
        
        return new ResponseEntity<>("Precios guardados correctamente", Constants.HEADERS_TEXT_PLAIN, HttpStatusCode.valueOf(200));
    }

    @Operation(summary = "Get driver's prices", tags = Constants.TAG_FANTASY)
    @GetMapping("/allDriverPrices")
    public List<FantasyPriceDriverDTO> getDriverPrices(@RequestParam(name = "raceId", required = true) Integer raceId) {
        Log.info("START - getDriverPrices - START");
        Log.info("RequestParam getDriverPrices (raceId) -> " + raceId);

        List<FantasyPriceDriverDTO> fantasyPriceDriverDTOs = new ArrayList<>();
        List<FantasyPriceDriver> fantasyPriceDrivers = this.fantasyPriceDriverRepository.findByRaceId((long) raceId);
        fantasyPriceDriverDTOs = this.fantasyPriceMapper.convertFantasyPriceDriverToFantasyPriceDriverDTO(fantasyPriceDrivers);

        Log.info("END - getDriverPrices - END");
        
        return fantasyPriceDriverDTOs;
    }


    @Operation(summary = "Get team's prices", tags = Constants.TAG_FANTASY)
    @GetMapping("/allTeamPrices")
    public List<FantasyPriceTeamDTO> getTeamPrices(@RequestParam(name = "raceId", required = true) Integer raceId) {
        Log.info("START - getTeamPrices - START");
        Log.info("RequestParam getTeamPrices (raceId) -> " + raceId);

        List<FantasyPriceTeamDTO> fantasyPriceTeamDTOs = new ArrayList<>();
        List<FantasyPriceTeam> fantasyPriceTeams = this.fantasyPriceTeamRepository.findByRaceId((long) raceId);
        fantasyPriceTeamDTOs = this.fantasyPriceMapper.convertFantasyPriceTeamToFantasyPriceTeamDTO(fantasyPriceTeams);
        
        Log.info("END - getTeamPrices - END");
        
        return fantasyPriceTeamDTOs;
    }

    @Operation(summary = "Get a driver points", tags = Constants.TAG_FANTASY)
    @GetMapping("/getInfobyDriver")
    public FantasyDriverInfoDTO getInfobyDriver(@RequestParam int driverId) {
        Log.info("START - getInfobyDriver - START");
        Log.info("RequestParam getInfobyDriver (driverId) -> " + driverId);
        
        FantasyDriverInfoDTO driverInfoDTO = new FantasyDriverInfoDTO();

        int totalPoints = 0;
        List<FantasyPointsDriver> fantasyPointsDriver = this.fantasyPointsDriverRepository.findByDriverId((long) driverId);
        
        if (!fantasyPointsDriver.isEmpty()) {
            for(FantasyPointsDriver driver : fantasyPointsDriver) {
                totalPoints += driver.getPoints();
            }
        }
        driverInfoDTO.setTotalPoints(totalPoints);

        List<FantasyPriceDriver> fantasyPriceDriver = this.fantasyPriceDriverRepository.findTwoLastPrices((long) driverId);
        if (fantasyPriceDriver.size() < 2) return driverInfoDTO;

        double price1 = fantasyPriceDriver.get(0).getPrice();
        double price2 = fantasyPriceDriver.get(1).getPrice();
        double difference = price2 - price1;
        double percentage = ((difference / price2) * 100) * -1;

        driverInfoDTO.setDifferencePrice(percentage);
        Log.info("END - getInfobyDriver - END");
        return driverInfoDTO;
    }
    
    
}
