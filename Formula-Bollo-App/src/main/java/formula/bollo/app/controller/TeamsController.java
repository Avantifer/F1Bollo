package formula.bollo.app.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import formula.bollo.app.entity.Driver;
import formula.bollo.app.entity.Result;
import formula.bollo.app.entity.Team;
import formula.bollo.app.mapper.DriverMapper;
import formula.bollo.app.mapper.TeamMapper;
import formula.bollo.app.model.TeamDTO;
import formula.bollo.app.model.TeamWithDriversDTO;
import formula.bollo.app.repository.DriverRepository;
import formula.bollo.app.repository.ResultRepository;
import formula.bollo.app.repository.TeamRepository;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping(path = {"/teams"}, produces = MediaType.APPLICATION_JSON_VALUE)
public class TeamsController {
    
    @Autowired
    TeamRepository teamRepository;

    @Autowired
    DriverRepository driverRepository;

    @Autowired
    ResultRepository resultRepository;

    @Autowired
    TeamMapper teamMapper;

    @Autowired
    DriverMapper driverMapper;

    private Map<Long, TeamDTO> teamCache = new ConcurrentHashMap<>();

    @Operation(summary = "Get all teams")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Teams successfully obtained"),
        @ApiResponse(code = 404, message = "Teams cannot be found"),
        @ApiResponse(code = 500, message = "There was an error, contact with administrator")
    })
    @GetMapping("/all")
    public List<TeamDTO> getAllTeams() {
        if (teamCache.isEmpty()) {
            List<Team> teams = teamRepository.findAll();
            
            for(Team team : teams) {
                TeamDTO teamDTO = teamMapper.teamToTeamDTO(team);
                teamCache.put(team.getId(), teamDTO);
            }
        }
        return new ArrayList<>(teamCache.values());
    }

    @Operation(summary = "Get all teams with their drives")
    @ApiResponses(value =  {
        @ApiResponse(code = 200, message = "Teams successfully obtained"),
        @ApiResponse(code = 404, message = "Teams cannot be found"),
        @ApiResponse(code = 500, message = "There was an error, contact with administrator")
    })
    @GetMapping("/withDrivers")
    public List<TeamWithDriversDTO> getAllTeamWithDrivers() {

        List<Driver> drivers = driverRepository.findAll(Sort.by("team.id"));

        Map<Team, TeamWithDriversDTO> teamMap = new HashMap<>();
 
        for (Driver driver : drivers) {
            Team team = driver.getTeam();
            
            //Create the hashMap to assign correctly the drivers to the team
            TeamWithDriversDTO teamWithDrivers = teamMap.computeIfAbsent(team, f -> {
                TeamWithDriversDTO dto = new TeamWithDriversDTO();
                dto.setTeamDTO(teamMapper.teamToTeamDTOnoTeamImage(team));
                return dto;
            });

            List<Result> resultOfDriver = this.resultRepository.findByDriverId(driver.getId());
            Integer pointsOfDriver = 0;

            // Add all the points of the pilot and put it to the total of the team
            for(Result result : resultOfDriver) {
                if (result.getPosition() != null) {
                    pointsOfDriver += result.getPosition().getPoints() + result.getFastlap();
                }
            }

            if (teamWithDrivers.getTotalPoints() != null) {
                teamWithDrivers.setTotalPoints(teamWithDrivers.getTotalPoints() + pointsOfDriver);
            }else {
                teamWithDrivers.setTotalPoints(pointsOfDriver);
            }

            // Assign driver1 and driver2 to the team
            if (teamWithDrivers.getDriver1() == null) {
                teamWithDrivers.setDriver1(driverMapper.driverToDriverDTO(driver));
            } else if (teamWithDrivers.getDriver2() == null) {
                teamWithDrivers.setDriver2(driverMapper.driverToDriverDTO(driver));
            }
        }

        List<TeamWithDriversDTO> teamsWithDriversDTOList = new ArrayList<>(teamMap.values());

        // Sort the list by totalPoints
        Collections.sort(teamsWithDriversDTOList, Comparator.comparingInt(TeamWithDriversDTO::getTotalPoints).reversed());

        return teamsWithDriversDTOList;
    } 
}
