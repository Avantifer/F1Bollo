package formula.bollo.app.mapper;

import java.util.List;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Season;
import formula.bollo.app.model.SeasonDTO;

@Component
public interface SeasonMapper {
    
    SeasonMapper INSTANCE = Mappers.getMapper(SeasonMapper.class);

    Season seasonDTOToSeason(SeasonDTO seasonDTO);

    SeasonDTO seasonToSeasonDTO(Season season);

    List<SeasonDTO> convertSeasonsToSeasonsDTO(List<Season> seasons);
}
