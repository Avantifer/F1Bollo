package formula.bollo.app.mapper;

import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Team;
import formula.bollo.app.model.TeamDTO;

@Component
public interface TeamMapper {
    Team teamDTOToTeam(TeamDTO teamDTO);

    TeamDTO teamToTeamDTO(Team team);
}
