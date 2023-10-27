package formula.bollo.app.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import formula.bollo.app.entity.Driver;
import formula.bollo.app.mapper.DriverMapper;
import formula.bollo.app.model.DriverDTO;
import formula.bollo.app.repository.DriverRepository;
import formula.bollo.app.utils.Constants;
import formula.bollo.app.utils.Log;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;


@CrossOrigin(origins = Constants.PRODUCTION_FRONTEND)
@RestController
@RequestMapping(path = {Constants.ENDPOINT_DRIVER}, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = Constants.TAG_DRIVER, description = Constants.TAG_DRIVER_SUMMARY)
public class DriverController {

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private DriverMapper driverMapper;

    @Operation(summary = "Get all drivers", tags = Constants.TAG_DRIVER)
    @GetMapping("/all")
    public List<DriverDTO> getAllDrivers(@RequestParam(value = "season", required = false) Integer season) {
        Log.info("START - getAllDrivers - START");
        Log.info("RequestParam getAllDrivers (season) -> " + season);
        
        int numberSeason = season == null ? Constants.ACTUAL_SEASON : season;
        List<Driver> drivers = driverRepository.findBySeason(numberSeason);
        List<DriverDTO> driverDTOs = new ArrayList<>();
        
        if (drivers.isEmpty()) return driverDTOs;
        driverDTOs = driverMapper.convertDriversToDriverDTONoImage(drivers);
    
        Log.info("END - getAllDrivers - END");
        
        return driverDTOs;
    }
    
}