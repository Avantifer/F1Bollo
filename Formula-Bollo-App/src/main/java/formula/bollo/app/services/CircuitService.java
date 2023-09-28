package formula.bollo.app.services;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import formula.bollo.app.entity.Circuit;
import formula.bollo.app.mapper.CircuitMapper;
import formula.bollo.app.model.CircuitDTO;
import formula.bollo.app.repository.CircuitRepository;

@Service
public class CircuitService {
    
    @Autowired
    private CircuitRepository circuitRepository;

    @Autowired
    private CircuitMapper circuitMapper;

    /**
     * Puts circuits into a cache if the cache is empty.
     *
     * @param cache The cache map where circuits are stored.
    */
    public void putCircuitsOnCache(Map<Long, CircuitDTO> cache) {
        if (!cache.isEmpty()) return;
        List<Circuit> circuits = circuitRepository.findAll();

        Map<Long, CircuitDTO> circuitDTOMap = circuits.parallelStream()
                .collect(Collectors.toMap(Circuit::getId, circuitMapper::circuitToCircuitDTO));
        
        cache.putAll(circuitDTOMap);
    }
}
