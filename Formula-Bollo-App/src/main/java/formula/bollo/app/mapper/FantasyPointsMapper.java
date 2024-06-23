package formula.bollo.app.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import formula.bollo.app.entity.FantasyPointsDriver;
import formula.bollo.app.entity.FantasyPointsTeam;
import formula.bollo.app.model.FantasyPointsDriverDTO;
import formula.bollo.app.model.FantasyPointsTeamDTO;

@Component
public interface FantasyPointsMapper {
    FantasyPointsDriverDTO fantasyPointsDriverToFantasyPointsDriverDTO(FantasyPointsDriver fantasyPointsDriver);

    List<FantasyPointsDriverDTO> convertFantasyPointsDriverToFantasyPointsDriverDTO(List<FantasyPointsDriver> fantasyPointsDrivers);

    FantasyPointsTeamDTO fantasyPointsTeamToFantasyPointsTeamDTO(FantasyPointsTeam fantasyPointsTeam);

    List<FantasyPointsTeamDTO> convertFantasyPointsTeamToFantasyPointsTeamDTO(List<FantasyPointsTeam> fantasyPointsTeams);
}
