package formula.bollo.app.mapper;

import java.util.List;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Sprint;
import formula.bollo.app.model.SprintDTO;

@Component
public interface SprintMapper {
    
    SprintMapper INSTANCE = Mappers.getMapper(SprintMapper.class);

    Sprint sprintDTOToSprint(SprintDTO sprintDTO);

    SprintDTO sprintToSprintDTO(Sprint sprint);

    List<SprintDTO> convertSprintsToSprintsDTO(List<Sprint> sprints);
}
