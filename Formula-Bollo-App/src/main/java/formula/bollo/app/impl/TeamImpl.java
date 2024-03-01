package formula.bollo.app.impl;

import java.sql.Blob;
import java.sql.SQLException;
import java.util.Base64;

import javax.sql.rowset.serial.SerialBlob;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Team;
import formula.bollo.app.mapper.SeasonMapper;
import formula.bollo.app.mapper.TeamMapper;
import formula.bollo.app.model.TeamDTO;
import formula.bollo.app.utils.Log;

@Component
public class TeamImpl implements TeamMapper{
    
    private SeasonMapper seasonMapper;

    public TeamImpl(SeasonMapper seasonMapper) {
        this.seasonMapper = seasonMapper;
    }

    /**
     * Converts a TeamDTO object to a Team object.
     *
     * @param teamDTO The TeamDTO object to be converted.
     * @return        A Team object with properties copied from the TeamDTO.
    */
    @Override
    public Team teamDTOToTeam(TeamDTO teamDTO) {
        Team team = new Team();

        try {
            byte[] decodedByteLogoImage = Base64.getDecoder().decode(teamDTO.getLogoImage());
            Blob logoImage = new SerialBlob(decodedByteLogoImage);

            BeanUtils.copyProperties(teamDTO, team);
            team.setLogoImage(logoImage);
        } catch (SQLException | IllegalArgumentException e) {
            Log.error("No se ha podido obtener el blob de base64: ", e);
        }
        
        team.setSeason(this.seasonMapper.seasonDTOToSeason(teamDTO.getSeason()));

        return team;
    }

    /**
     * Converts a Team object to a TeamDTO object.
     *
     * @param team The Team object to be converted.
     * @return     A TeamDTO object with properties copied from the Team.
    */
    @Override
    public TeamDTO teamToTeamDTO(Team team) {
        TeamDTO teamDTO = new TeamDTO();

        try {
            String logoImage = Base64.getEncoder().encodeToString(team.getLogoImage().getBytes(1, (int) team.getLogoImage().length()));

            BeanUtils.copyProperties(team, teamDTO);
            teamDTO.setLogoImage(logoImage);
        } catch (SQLException e) {
            Log.error("No se ha podido obtener la base64 del blob: ", e);
        }
        
        teamDTO.setSeason(this.seasonMapper.seasonToSeasonDTO(team.getSeason()));
        
        return teamDTO;
    }

    /**
     * Converts a Team object to a TeamDTO object excluding the team image.
     *
     * @param team The Team object to be converted.
     * @return     A TeamDTO object with properties copied from the Team excluding the team image.
    */
    @Override
    public TeamDTO teamToTeamDTOnoTeamImage(Team team) {
        TeamDTO teamDTO = new TeamDTO();
        BeanUtils.copyProperties(team, teamDTO, "carImage");
        teamDTO.setCarImage(team.getCarImage());
        teamDTO.setSeason(this.seasonMapper.seasonToSeasonDTO(team.getSeason()));

        return teamDTO;
    }
}
