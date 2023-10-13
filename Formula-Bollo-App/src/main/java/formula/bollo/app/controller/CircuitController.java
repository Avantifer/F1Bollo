package formula.bollo.app.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

@CrossOrigin(origins = Constants.URL_FRONTED)
@RestController
@RequestMapping(path = {Constants.ENDPOINT_CIRCUIT}, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = Constants.TAG_CIRCUIT, description = Constants.TAG_CIRCUIT_SUMMARY)
public class CircuitController {

    @Autowired
    private CircuitService circuitService;

    private Map<Long, CircuitDTO> circuitsCache = new ConcurrentHashMap<>();

    @Operation(summary = "Get all circuits", tags = Constants.TAG_CIRCUIT)
    @GetMapping("/all")
    public List<CircuitDTO> getAllCircuits() {
        Log.info("START - getAllCircuits - START");
        
        this.circuitService.putCircuitsOnCache(circuitsCache);
        
        Log.info("END - getAllCircuits - END");

        return new ArrayList<>(circuitsCache.values());
    }
}
