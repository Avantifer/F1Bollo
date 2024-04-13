package formula.bollo.app.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import formula.bollo.app.entity.Driver;
import formula.bollo.app.mapper.DriverMapper;
import formula.bollo.app.model.DriverDTO;
import formula.bollo.app.model.DriverInfoDTO;
import formula.bollo.app.repository.DriverRepository;
import formula.bollo.app.services.DriverService;
import formula.bollo.app.utils.Constants;
import formula.bollo.app.utils.Log;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.ArrayList;
import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.MediaType;


@CrossOrigin(origins = Constants.PRODUCTION_FRONTEND)
@RestController
@RequestMapping(path = {Constants.ENDPOINT_DRIVER}, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = Constants.TAG_DRIVER, description = Constants.TAG_DRIVER_SUMMARY)
public class DriverController {

    private DriverRepository driverRepository;
    private DriverMapper driverMapper;
    private DriverService driverService;

    public DriverController(
        DriverRepository driverRepository,
        DriverMapper driverMapper,
        DriverService driverService
    ) {
        this.driverRepository = driverRepository;
        this.driverMapper = driverMapper;
        this.driverService = driverService;
    }

    @Operation(summary = "Get all drivers", tags = Constants.TAG_DRIVER)
    @GetMapping("/all")
    public List<DriverDTO> getAllDrivers(@RequestParam(value = "season", required = false) Integer season) {
        Log.info("START - getAllDrivers - START");
        Log.info("RequestParam getAllDrivers (season) -> " + season);
        
        int numberSeason = season == null ? Constants.ACTUAL_SEASON : season;
        List<Driver> drivers = driverRepository.findBySeason(numberSeason);
        List<DriverDTO> driverDTOs = new ArrayList<>();
        
        if (drivers.isEmpty()) return driverDTOs;
        driverDTOs = driverMapper.convertDriversToDriverDTO(drivers);
    
        Log.info("END - getAllDrivers - END");
        
        return driverDTOs;
    }

    @Operation(summary = "Get info of a driver", tags = Constants.TAG_DRIVER)
    @GetMapping("/infoDriverByName")
    public DriverInfoDTO getinfoDriverByName(@RequestParam(value = "season", required = false) Integer season, @RequestParam(value = "driverName") String driverName) {
        Log.info("START - getinfoDriverByName - START");
        Log.info("RequestParam getinfoDriverByName (season) -> " + season);
        Log.info("RequestParam getinfoDriverByName (driverName) -> " + driverName);
        List<Driver> drivers;
        DriverInfoDTO driverInfoDTO;

        if (season == null) {
            drivers = driverRepository.findByName(driverName);
        } else {
            drivers = driverRepository.findByNameAndSeason(season, driverName);
        }
        
        driverInfoDTO = this.driverService.getAllInfoDriver(drivers);
        
        Log.info("END - getinfoDriverByName - END");
        
        return driverInfoDTO;
    }

    @Operation(summary = "Get drivers of an id team", tags = Constants.TAG_DRIVER)
    @GetMapping("/byTeam")
    public List<DriverDTO> getDriversByTeam(@RequestParam int teamId) {
        Log.info("START - getinfoDriverByName - START");
        Log.info("RequestParam getinfoDriverByName (teamId) -> " + teamId);

        List<DriverDTO> driverDTOs = new ArrayList<>();
        List<Driver> drivers = this.driverRepository.findByTeam((long) teamId);

        if (drivers.isEmpty()) return driverDTOs;
        driverDTOs = driverMapper.convertDriversToDriverDTO(drivers);

        Log.info("END - getinfoDriverByName - END");
        return driverDTOs;
    }

    @Operation(summary = "Get all info of drivers", tags = Constants.TAG_TEAM)
    @GetMapping("/allInfoDriver")
    @Cacheable(value = "driversCache", key = "#season")
    public List<DriverInfoDTO> getAllInfoDriver(@RequestParam(value = "season", required = false) Integer season) {
        Log.info("START - getAllInfoDriver - START");
        List<DriverInfoDTO> driversInfoDTO = new ArrayList<>();

        List<Driver> drivers;

        if (season == null) {
            drivers = driverRepository.findAll();
        } else {
            drivers = driverRepository.findBySeason(season);
        }
        
        for(Driver driver : drivers) {
            List<Driver> driverToFind = new ArrayList<>();
            driverToFind.add(driver);
            driversInfoDTO.add(this.driverService.getAllInfoDriver(driverToFind));
        }

        driversInfoDTO = this.driverService.sumDuplicates(driversInfoDTO);

        Log.info("END - getAllInfoDriver - END");
        return driversInfoDTO;
    }
}
