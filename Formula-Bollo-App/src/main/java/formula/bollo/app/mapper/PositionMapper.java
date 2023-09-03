package formula.bollo.app.mapper;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Position;
import formula.bollo.app.model.PositionDTO;

@Component
public interface PositionMapper {
    
    PositionMapper INSTANCE = Mappers.getMapper(PositionMapper.class);

    Position positionDTOToPosition(PositionDTO positionDTO);

    PositionDTO positionToPositionDTO(Position position);
}
