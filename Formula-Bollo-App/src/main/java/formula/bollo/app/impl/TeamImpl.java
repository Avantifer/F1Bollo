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
     * Map TeamDTO to return an object type Team
     * @param teamDTO
     * @exception SQLException Cannot do something with the db
     * @exception IllegalArgumentException Cannot convert string to byte[]
     * @return class Team with TeamDTO properties
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
     * Map Team to return an object type TeamDTO
     * @param team
     * @exception SQLException Cannot do something with the db
     * @return class TeamDTO with Team properties
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
     * Map Team to return an object type TeamDTO without teamImage
     * @param team
     * @return class TeamDTO with almost all Team's properties (no carImage)
    */
    @Override
    public TeamDTO teamToTeamDTOnoTeamImage(Team team) {
        TeamDTO teamDTO = new TeamDTO();
        BeanUtils.copyProperties(team, teamDTO, "carImage");
        teamDTO.setCarImage(team.getCarImage());
        return teamDTO;
    }

}
