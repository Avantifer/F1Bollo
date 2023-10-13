package formula.bollo.app.impl;

import java.sql.Blob;
import java.sql.SQLException;
import java.util.Base64;

import javax.sql.rowset.serial.SerialBlob;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Team;
import formula.bollo.app.mapper.TeamMapper;
import formula.bollo.app.model.TeamDTO;
import formula.bollo.app.utils.Log;

@Component
public class TeamImpl implements TeamMapper{
    
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
            byte[] decodedByte = Base64.getDecoder().decode(teamDTO.getTeamImage());
            Blob teamImage = new SerialBlob(decodedByte);
            BeanUtils.copyProperties(teamDTO, team);
            team.setTeamImage(teamImage);
        } catch (SQLException | IllegalArgumentException e) {
            Log.error("No se ha podido obtener el blob de base64: ", e);
        }

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
            String teamImage = Base64.getEncoder().encodeToString(team.getTeamImage().getBytes(1, (int) team.getTeamImage().length()));
            BeanUtils.copyProperties(team, teamDTO);
            teamDTO.setTeamImage(teamImage);
        } catch (SQLException e) {
            Log.error("No se ha podido obtener la base64 del blob: ", e);
        }
        
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
        return teamDTO;
    }
}
