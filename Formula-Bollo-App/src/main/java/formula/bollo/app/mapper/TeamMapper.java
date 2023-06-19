package formula.bollo.app.mapper;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Team;
import formula.bollo.app.model.TeamDTO;

@Component
public interface TeamMapper {
    
    TeamMapper INSTANCE = Mappers.getMapper(TeamMapper.class);

    Team teamDTOToTeam(TeamDTO teamDTO);

    TeamDTO teamToTeamDTO(Team team);
}
