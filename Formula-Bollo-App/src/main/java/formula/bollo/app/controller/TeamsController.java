package formula.bollo.app.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import formula.bollo.app.entity.Team;
import formula.bollo.app.mapper.TeamMapper;
import formula.bollo.app.model.TeamDTO;
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
    TeamMapper teamMapper;

    private Map<Long, TeamDTO> teamCache = new ConcurrentHashMap<>();

    @Operation(summary = "Get all teams")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Teams successfully obtained"),
        @ApiResponse(code = 404, message = "Teams cannot be found")
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
}
