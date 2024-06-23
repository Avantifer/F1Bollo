package formula.bollo.app.mapper;

import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Position;
import formula.bollo.app.model.PositionDTO;

@Component
public interface PositionMapper {
    Position positionDTOToPosition(PositionDTO positionDTO);

    PositionDTO positionToPositionDTO(Position position);
}
