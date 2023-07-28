package formula.bollo.app.mapper;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Circuit;
import formula.bollo.app.model.CircuitDTO;

@Component
public interface CircuitMapper {
    
    CircuitMapper INSTANCE = Mappers.getMapper(CircuitMapper.class);

    Circuit circuitDTOToCircuit(CircuitDTO circuitDTO);

    CircuitDTO circuitToCircuitDTO(Circuit circuit);
}
