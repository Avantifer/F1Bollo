package formula.bollo.app.mapper;

import java.util.List;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.FantasyPriceDriver;
import formula.bollo.app.entity.FantasyPriceTeam;
import formula.bollo.app.model.FantasyPriceDriverDTO;
import formula.bollo.app.model.FantasyPriceTeamDTO;

@Component
public interface FantasyPriceMapper {
    
    FantasyPriceMapper INSTANCE = Mappers.getMapper(FantasyPriceMapper.class);

    FantasyPriceDriver fantasyPriceDriverDTOToFantasyPriceDriver(FantasyPriceDriverDTO fantasyPriceDTO);

    FantasyPriceDriverDTO fantasyPriceDriverToFantasyPriceDriverDTO(FantasyPriceDriver fantasyPrice);

    List<FantasyPriceDriverDTO> convertFantasyPriceDriverToFantasyPriceDriverDTO(List<FantasyPriceDriver> fantasyPrices);

    FantasyPriceTeam fantasyPriceTeamDTOToFantasyPriceTeam(FantasyPriceTeamDTO fantasyPriceDTO);

    FantasyPriceTeamDTO fantasyPriceTeamToFantasyPriceTeamDTO(FantasyPriceTeam fantasyPrice);

    List<FantasyPriceTeamDTO> convertFantasyPriceTeamToFantasyPriceTeamDTO(List<FantasyPriceTeam> fantasyPrices);
}
