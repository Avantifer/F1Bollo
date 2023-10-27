package formula.bollo.app.impl;

import org.springframework.beans.BeanUtils;
import org.springframework.context.annotation.Configuration;

import formula.bollo.app.entity.Position;
import formula.bollo.app.mapper.PositionMapper;
import formula.bollo.app.model.PositionDTO;

@Configuration
public class PositionImpl implements PositionMapper {

    /**
     * Converts a PositionDTO object to a Position object.
     *
     * @param positionDTO The PositionDTO object to be converted.
     * @return            A Position object with properties copied from the PositionDTO.
    */
    @Override
    public Position positionDTOToPosition(PositionDTO positionDTO) {
        Position position = new Position();
        BeanUtils.copyProperties(positionDTO, position);
        
        return position;
    }

    /**
     * Converts a Position object to a PositionDTO object.
     *
     * @param position The Position object to be converted.
     * @return         A PositionDTO object with properties copied from the Position.
    */
    @Override
    public PositionDTO positionToPositionDTO(Position position) {
        PositionDTO positionDTO = new PositionDTO();
        BeanUtils.copyProperties(position, positionDTO);
        
        return positionDTO;
    }
}
