package formula.bollo.app.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import formula.bollo.app.entity.Circuit;
import formula.bollo.app.mapper.CircuitMapper;
import formula.bollo.app.model.CircuitDTO;
import formula.bollo.app.repository.CircuitRepository;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.v3.oas.annotations.Operation;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

@CrossOrigin(origins = "https://formulabollo.es")
@RestController
@RequestMapping(path = {"/circuits"}, produces = MediaType.APPLICATION_JSON_VALUE)
public class CircuitController {

    @Autowired
    private CircuitRepository circuitRepository;

    @Autowired
    private CircuitMapper circuitMapper;

    private Map<Long, CircuitDTO> circuitsCache = new ConcurrentHashMap<>();

    @Operation(summary = "Get all configurations")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Configurations successfully obtained"),
        @ApiResponse(code = 404, message = "Configurations cannot be found"),
        @ApiResponse(code = 500, message = "There was an error, contact with administrator")
    })
    @GetMapping("/all")
    public List<CircuitDTO> getAllConfigurations() {
        if (circuitsCache.isEmpty()) {
            List<Circuit> circuits = circuitRepository.findAll();
            
            for(Circuit circuit : circuits) {
                CircuitDTO circuitDTO = circuitMapper.circuitToCircuitDTO(circuit);
                circuitsCache.put(circuit.getId(), circuitDTO);
            }
        }

        return new ArrayList<>(circuitsCache.values());
    }
}
