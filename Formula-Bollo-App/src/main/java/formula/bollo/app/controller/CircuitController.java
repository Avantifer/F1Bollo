package formula.bollo.app.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import formula.bollo.app.model.CircuitDTO;
import formula.bollo.app.services.CircuitService;
import formula.bollo.app.utils.Constants;
import formula.bollo.app.utils.Log;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.http.MediaType;

@CrossOrigin(origins = Constants.PRODUCTION_FRONTEND)
@RestController
@RequestMapping(path = {Constants.ENDPOINT_CIRCUIT}, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = Constants.TAG_CIRCUIT, description = Constants.TAG_CIRCUIT_SUMMARY)
public class CircuitController {

    private CircuitService circuitService;
    private Map<Long, CircuitDTO> circuitsCache = new ConcurrentHashMap<>();

    public CircuitController(CircuitService circuitService) {
        this.circuitService = circuitService;
    }

    @Operation(summary = "Get all circuits", tags = Constants.TAG_CIRCUIT)
    @GetMapping("/all")
    public List<CircuitDTO> getAllCircuits(@RequestParam(value = "season", required = false) Integer season) {
        Log.info("START - getAllCircuits - START");
        Log.info("RequestParam getAllCircuits (season) -> " + season);

        List<CircuitDTO> circuitDTOs = new ArrayList<>();

        if (season == null || season == Constants.ACTUAL_SEASON) {
            this.circuitService.putCircuitsOnCache(circuitsCache);
            circuitDTOs = circuitsCache.values().stream().collect(Collectors.toList());
        } else {
            circuitDTOs = this.circuitService.getCircuitsSeason(season);
        }
        
        Log.info("END - getAllCircuits - END");
        
        return circuitDTOs;
    }
}
