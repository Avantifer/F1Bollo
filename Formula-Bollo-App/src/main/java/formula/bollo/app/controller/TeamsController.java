package formula.bollo.app.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import formula.bollo.app.entity.Driver;
import formula.bollo.app.model.TeamDTO;
import formula.bollo.app.model.TeamWithDriversDTO;
import formula.bollo.app.repository.DriverRepository;
import formula.bollo.app.services.TeamService;
import formula.bollo.app.utils.Constants;
import formula.bollo.app.utils.Log;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@CrossOrigin(origins = Constants.PRODUCTION_FRONTEND)
@RestController
@RequestMapping(path = {Constants.ENDPOINT_TEAMS}, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = Constants.TAG_TEAM, description = Constants.TAG_TEAM_SUMMARY)
public class TeamsController {
    
    @Autowired
    private TeamService teamService;

    @Autowired
    private DriverRepository driverRepository;

    private Map<Long, TeamDTO> teamCache = new ConcurrentHashMap<>();

    @Operation(summary = "Get all teams", tags = Constants.TAG_TEAM)
    @GetMapping("/all")
    public List<TeamDTO> getAllTeams(@RequestParam(value = "season", required = false) Integer season) {
        Log.info("START - getAllTeams - START");
        
        List<TeamDTO> teamDTOs = new ArrayList<>();

        if (season == null || season == Constants.ACTUAL_SEASON) {
            teamService.putTeamsOnCache(teamCache);
            teamDTOs = teamCache.values().stream().collect(Collectors.toList());
        } else {
            teamDTOs = this.teamService.getTeamsBySeason(season);
        }

        Log.info("END - getAllTeams - END");
        
        return teamDTOs;
    }

    @Operation(summary = "Get all teams with their drives", tags = Constants.TAG_TEAM)
    @GetMapping("/withDrivers")
    public List<TeamWithDriversDTO> getAllTeamWithDrivers(@RequestParam(value = "season", required = false) Integer season) {
        Log.info("START - getAllTeamWithDrivers - START");

        int numberSeason = season == null ? Constants.ACTUAL_SEASON : season;
        List<Driver> drivers = driverRepository.findBySeason(numberSeason);
        List<TeamWithDriversDTO> teamsWithDriversDTOList = new ArrayList<>();

        if(drivers.isEmpty()) return teamsWithDriversDTOList;

        teamsWithDriversDTOList = teamService.getTeamWithDriversDTO(drivers);

        Log.info("END - getAllTeamWithDrivers - END");

        return teamsWithDriversDTOList;
    } 
}
