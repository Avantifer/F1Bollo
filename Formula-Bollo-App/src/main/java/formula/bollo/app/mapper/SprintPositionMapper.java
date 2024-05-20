package formula.bollo.app.mapper;

import org.springframework.stereotype.Component;

import formula.bollo.app.entity.SprintPosition;
import formula.bollo.app.model.SprintPositionDTO;

@Component
public interface SprintPositionMapper {
    SprintPosition sprintPositionDTOToSprintPosition(SprintPositionDTO sprintPositionDTO);

    SprintPositionDTO sprintPositionToSprintPositionDTO(SprintPosition sprintPosition);
}
