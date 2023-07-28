package formula.bollo.app.impl;

import org.springframework.beans.BeanUtils;
import org.springframework.context.annotation.Configuration;

import formula.bollo.app.entity.Position;
import formula.bollo.app.mapper.PositionMapper;
import formula.bollo.app.model.PositionDTO;

@Configuration
public class PositionImpl implements PositionMapper {

    /**
     * Map PositionDTO to return an object type Position
     * @param positionDTO
     * @return class Position with PositionDTO properties
    */
    @Override
    public Position positionDTOToPosition(PositionDTO positionDTO) {
        Position position = new Position();
        BeanUtils.copyProperties(positionDTO, position);
        return position;
    }

    /**
     * Map PositionDTO to return an object type Position
     * @param positionDTO
     * @return class Position with PositionDTO properties
    */
    @Override
    public PositionDTO positionToPositionDTO(Position position) {
        PositionDTO positionDTO = new PositionDTO();
        BeanUtils.copyProperties(position, positionDTO);
        
        return positionDTO;
    }
    
}
