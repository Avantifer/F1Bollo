package formula.bollo.app.mapper;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Championship;
import formula.bollo.app.model.ChampionshipDTO;

@Component
public interface ChampionshipMapper {
    
    ChampionshipMapper INSTANCE = Mappers.getMapper(ChampionshipMapper.class);

    Championship championshipDTOToChampionship(ChampionshipDTO circuitDTO);

    ChampionshipDTO championshipToChampionshipDTO(Championship circuit);
}
