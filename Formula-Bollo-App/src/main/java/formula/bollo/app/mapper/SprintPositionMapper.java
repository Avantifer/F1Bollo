package formula.bollo.app.mapper;

import java.util.List;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.SprintPosition;
import formula.bollo.app.model.SprintPositionDTO;

@Component
public interface SprintPositionMapper {
    
    SprintPositionMapper INSTANCE = Mappers.getMapper(SprintPositionMapper.class);

    SprintPosition sprintPositionDTOToSprintPosition(SprintPositionDTO sprintPositionDTO);

    SprintPositionDTO sprintPositionToSprintPositionDTO(SprintPosition sprintPosition);

    List<SprintPositionDTO> convertSprintPositionsToSprintPositionsDTO(List<SprintPosition> sprintPositions);
}
