package formula.bollo.app.impl;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.SprintPosition;
import formula.bollo.app.mapper.SprintPositionMapper;
import formula.bollo.app.model.SprintPositionDTO;

@Component
public class SprintPositionImpl implements SprintPositionMapper{
    
    /**
     * Converts a SprintPositionDTO object to a SprintPosition object.
     *
     * @param sprintPositionDTO The SprintPositionDTO object to be converted.
     * @return        A SprintPosition object with properties copied from the SprintPositionDTO.
    */
    @Override
    public SprintPosition sprintPositionDTOToSprintPosition(SprintPositionDTO sprintPositionDTO) {
        SprintPosition sprint = new SprintPosition();
        if (sprintPositionDTO != null) {
            BeanUtils.copyProperties(sprintPositionDTO, sprint);
        }
        return sprint;
    }

    /**
     * Converts a SprintPosition object to a SprintPositionDTO object.
     *
     * @param sprintPosition The SprintPosition object to be converted.
     * @return     A SprintPositionDTO object with properties copied from the SprintPosition.
    */
    @Override
    public SprintPositionDTO sprintPositionToSprintPositionDTO(SprintPosition sprint) {
        SprintPositionDTO sprintPositionDTO = new SprintPositionDTO();
        BeanUtils.copyProperties(sprint, sprintPositionDTO);
        return sprintPositionDTO;
    }
}
