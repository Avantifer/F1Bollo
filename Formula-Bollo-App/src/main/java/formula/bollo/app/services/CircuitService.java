package formula.bollo.app.services;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import formula.bollo.app.entity.Circuit;
import formula.bollo.app.mapper.CircuitMapper;
import formula.bollo.app.model.CircuitDTO;
import formula.bollo.app.repository.CircuitRepository;
import formula.bollo.app.utils.Constants;

@Service
public class CircuitService {
    
    private final CircuitRepository circuitRepository;

    private final CircuitMapper circuitMapper;

    public CircuitService(CircuitRepository circuitRepository, CircuitMapper circuitMapper) {
        this.circuitRepository = circuitRepository;
        this.circuitMapper = circuitMapper;
    }

    /**
     * Puts circuits into a cache if the cache is empty.
     *
     * @param cache The cache map where circuits are stored.
    */
    public void putCircuitsOnCache(Map<Long, CircuitDTO> cache) {
        if (!cache.isEmpty()) return;
        List<Circuit> circuits = circuitRepository.findBySeason(Constants.ACTUAL_SEASON);

        Map<Long, CircuitDTO> circuitDTOMap = circuits.parallelStream()
                .collect(Collectors.toMap(Circuit::getId, circuitMapper::circuitToCircuitDTO));
        
        cache.putAll(circuitDTOMap);
    }

    /**
     * Retrieves a list of circuit data for a specific season.
     *
     * @param season The season for which circuit data is requested.
     * @return A list of CircuitDTO objects representing the circuits of the specified season.
    */
    public List<CircuitDTO> getCircuitsSeason(int season) {
        List<Circuit> circuits = circuitRepository.findBySeason(season);

        return circuits.parallelStream()
            .map(circuitMapper::circuitToCircuitDTO)
            .collect(Collectors.toList());
    }
}
