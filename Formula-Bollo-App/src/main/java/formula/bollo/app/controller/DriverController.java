package formula.bollo.app.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import formula.bollo.app.entity.Driver;
import formula.bollo.app.mapper.DriverMapper;
import formula.bollo.app.model.DriverDTO;
import formula.bollo.app.repository.DriverRepository;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.v3.oas.annotations.Operation;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;


@CrossOrigin(origins = "https://formulabollo.es")
@RestController
@RequestMapping(path = {"/drivers"}, produces = MediaType.APPLICATION_JSON_VALUE)
public class DriverController {

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private DriverMapper driverMapper;

    @Operation(summary = "Get all configurations")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Configurations successfully obtained"),
        @ApiResponse(code = 404, message = "Configurations cannot be found"),
        @ApiResponse(code = 500, message = "There was an error, contact with administrator")
    })
    @GetMapping("/all")
    public List<DriverDTO> getAllConfigurations() {
        List<Driver> drivers = driverRepository.findAll();
        List<DriverDTO> driverDTOs = new ArrayList<>();

        for(Driver driver : drivers) {
            driverDTOs.add(driverMapper.driverToDriverDTONoImage(driver));
        }
        
        return driverDTOs;
    }
    
}