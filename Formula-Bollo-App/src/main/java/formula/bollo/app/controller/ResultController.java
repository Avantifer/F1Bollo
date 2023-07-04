package formula.bollo.app.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import formula.bollo.app.entity.Result;
import formula.bollo.app.mapper.DriverMapper;
import formula.bollo.app.model.DriverDTO;
import formula.bollo.app.model.DriverPointsDTO;

import formula.bollo.app.repository.ResultRepository;
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
import org.springframework.http.MediaType;

@CrossOrigin(origins = "https://formulabollo.es")
@RestController
@RequestMapping(path = {"/results"}, produces = MediaType.APPLICATION_JSON_VALUE)
public class ResultController {
    
    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private DriverMapper driverMapper;

    @Operation(summary = "Get results total per driver")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Results successfully obtained"),
        @ApiResponse(code = 404, message = "Results cannot be found"),
        @ApiResponse(code = 500, message = "There was an error, contact with administrator")
    })
    @GetMapping("/totalPerDriver")
    public List<DriverPointsDTO> getTotalResultsPerDriver(@RequestParam(value = "numResults", required = false) Integer numResults) {
        List<Result> results = resultRepository.findAll();
        Map<DriverDTO, Integer> totalPointsByDriver = new HashMap<>();

        // We make the algorithm so that it takes all the results
        // And go adding the points grouping by the driver
        for (Result result : results) {
            DriverDTO driverDTO = driverMapper.driverToDriverDTO(result.getDriver());
            if (result.getPosition() != null) {
                int points = result.getPosition().getPoints();
                int fastlap = result.getFastlap();
                if (totalPointsByDriver.containsKey(driverDTO)) {
                    int currentPoints = totalPointsByDriver.get(driverDTO);
                    totalPointsByDriver.put(driverDTO, currentPoints + points + fastlap);
                } else {
                    totalPointsByDriver.put(driverDTO, points + fastlap);
                }
            }
        }

        // Convert the map to a list of DriverPointsDTO
        List<DriverPointsDTO> driverPointsDTOList = new ArrayList<>();
        for (Map.Entry<DriverDTO, Integer> entry : totalPointsByDriver.entrySet()) {
            DriverPointsDTO driverPointsDTO = new DriverPointsDTO(entry.getKey(), entry.getValue());
            driverPointsDTOList.add(driverPointsDTO);
        }

        // Compare all points and sorted DESC 
        Comparator<DriverPointsDTO> pointsComparator = Comparator.comparingInt(DriverPointsDTO::getTotalPoints);
        Collections.sort(driverPointsDTOList, pointsComparator.reversed());
        
        // Select how many results to return
        int numResultsToReturn = 0;

        if (numResults == null || numResults > driverPointsDTOList.size()) {
            numResultsToReturn = driverPointsDTOList.size();
        } else {
            numResultsToReturn  = Math.min(driverPointsDTOList.size(), numResults);
        }

        return  driverPointsDTOList.subList(0, numResultsToReturn);
    }
}
