package formula.bollo.app.mapper;

import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Circuit;
import formula.bollo.app.model.CircuitDTO;

@Component
public interface CircuitMapper {
    Circuit circuitDTOToCircuit(CircuitDTO circuitDTO);

    CircuitDTO circuitToCircuitDTO(Circuit circuit);
}
