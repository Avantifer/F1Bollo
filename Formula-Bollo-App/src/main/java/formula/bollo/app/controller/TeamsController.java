package formula.bollo.app.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import formula.bollo.app.entity.Driver;
import formula.bollo.app.entity.Team;
import formula.bollo.app.model.TeamDTO;
import formula.bollo.app.model.TeamInfoDTO;
import formula.bollo.app.model.TeamWithDriversDTO;
import formula.bollo.app.repository.DriverRepository;
import formula.bollo.app.repository.TeamRepository;
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
    
    private TeamService teamService;
    private DriverRepository driverRepository;
    private TeamRepository teamRepository;
    private Map<Long, TeamDTO> teamCache = new ConcurrentHashMap<>();

    public TeamsController(TeamService teamService, DriverRepository driverRepository, TeamRepository teamRepository) {
        this.teamService = teamService;
        this.driverRepository = driverRepository;
        this.teamRepository = teamRepository;
    }

    @Operation(summary = "Get all teams", tags = Constants.TAG_TEAM)
    @GetMapping("/all")
    public List<TeamDTO> getAllTeams(@RequestParam(value = "season", required = false) Integer season) {
        Log.info("START - getAllTeams - START");
        
        List<TeamDTO> teamDTOs;

        if (season == null || season == Constants.ACTUAL_SEASON) {
            teamService.putTeamsOnCache(teamCache);
            teamDTOs = teamCache.values().stream().toList();
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

    @Operation(summary = "Get info of a team", tags = Constants.TAG_TEAM)
    @GetMapping("/infoTeamByName")
    public TeamInfoDTO getinfoTeamByName(@RequestParam(value = "season", required = false) Integer season, @RequestParam(value = "teamName") String teamName) {
        Log.info("START - getinfoTeamByName - START");
        Log.info("RequestParam getinfoTeamByName (season) -> " + season);
        Log.info("RequestParam getinfoTeamByName (driverName) -> " + teamName);

        List<Team> teams;
        TeamInfoDTO teamInfoDTO;

        if (season == null) {
            teams = teamRepository.findByName(teamName);
        } else {
            teams = teamRepository.findByNameAndSeason(season, teamName);
        }
        
        teamInfoDTO = this.teamService.getAllInfoTeam(teams);
        Log.info("END - getinfoTeamByName - END");
        
        return teamInfoDTO;
    }

    @Operation(summary = "Get all info of teams", tags = Constants.TAG_DRIVER)
    @GetMapping("/allInfoTeam")
    public List<TeamInfoDTO> getAllInfoTeam(@RequestParam(value = "season", required = false) Integer season) {
        Log.info("START - getAllInfoTeam - START");
        List<TeamInfoDTO> teamsInfoDTO = new ArrayList<>();

        List<Team> teams;

        if (season == null) {
            teams = teamRepository.findAll();
        } else {
            teams = teamRepository.findBySeason(season);
        }
        
        for(Team team : teams) {
            List<Team> teamToFind = new ArrayList<>();
            teamToFind.add(team);
            teamsInfoDTO.add(this.teamService.getAllInfoTeam(teamToFind));
        }

        teamsInfoDTO = this.teamService.sumDuplicates(teamsInfoDTO);
        
        Log.info("END - getAllInfoTeam - END");
        return teamsInfoDTO;
    }
}
