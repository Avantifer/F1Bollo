package formula.bollo.app.services;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import formula.bollo.app.entity.Driver;
import formula.bollo.app.entity.Result;
import formula.bollo.app.entity.Sprint;
import formula.bollo.app.entity.Team;
import formula.bollo.app.mapper.DriverMapper;
import formula.bollo.app.mapper.TeamMapper;
import formula.bollo.app.model.TeamDTO;
import formula.bollo.app.model.TeamWithDriversDTO;
import formula.bollo.app.repository.ResultRepository;
import formula.bollo.app.repository.SprintRepository;
import formula.bollo.app.repository.TeamRepository;

@Service
public class TeamService {
 
    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TeamMapper teamMapper;

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private SprintRepository sprintRepository;

    @Autowired
    private DriverMapper driverMapper;

    /**
     * Puts teams into a cache if the cache is empty.
     *
     * @param cache The cache map where teams are stored.
    */
    public void putTeamsOnCache(Map<Long, TeamDTO> cache) {
        if (!cache.isEmpty()) return;

        List<Team> teams = teamRepository.findAll();

        Map<Long, TeamDTO> teamsDTOMap = teams.parallelStream()
                .collect(Collectors.toMap(Team::getId, teamMapper::teamToTeamDTO));
        
        cache.putAll(teamsDTOMap);        
    }

    /**
     * Gets a list of TeamWithDriversDTO objects based on a list of drivers.
     *
     * @param drivers The list of drivers to group by team and calculate points.
     * @return        A sorted list of TeamWithDriversDTO objects.
    */
    public List<TeamWithDriversDTO> getTeamWithDriversDTO(List<Driver> drivers) {
        return drivers.parallelStream()
            .collect(Collectors.groupingBy(Driver::getTeam))
            .entrySet().parallelStream()
            .map(entry -> {
                Team team = entry.getKey();
                List<Driver> teamDrivers = entry.getValue();

                int totalPoints = this.calculatePoints(teamDrivers);
                return this.assignTeamWithDrivers(teamDrivers, team, totalPoints);
            })
            .sorted(Comparator.comparingInt(TeamWithDriversDTO::getTotalPoints).reversed())
            .collect(Collectors.toList());
    }

    /**
     * Calculates total points for a list of team drivers.
     *
     * @param teamDrivers The list of team drivers.
     * @return            The total points for the team.
    */
    private int calculatePoints(List<Driver> teamDrivers) {
        return teamDrivers.parallelStream()
                .flatMap(driver -> {
                    int resultPoints = this.calculatePointsResults(driver);
                    int sprintPoints = this.calculatePointsSprints(driver);
                    return Stream.of(resultPoints, sprintPoints);
                })
                .mapToInt(Integer::intValue)
                .sum();
    }

    /**
     * Calculates total points for race results of a driver.
     *
     * @param driver The driver for whom points are calculated.
     * @return       The total points for race results.
    */
    private int calculatePointsResults(Driver driver) {
        List<Result> results = this.resultRepository.findByDriverId(driver.getId());

        return results.stream()
                .filter(result -> result.getPosition() != null)
                .mapToInt(result -> result.getPosition().getPoints() + result.getFastlap())
                .sum();
    }

    /**
     * Calculates total points for sprint results of a driver.
     *
     * @param driver The driver for whom points are calculated.
     * @return       The total points for sprint results.
    */
    private int calculatePointsSprints(Driver driver) {
        List<Sprint> sprints = this.sprintRepository.findByDriverId(driver.getId());

        return sprints.stream()
                .filter(sprint -> sprint.getPosition() != null)
                .mapToInt(sprint -> sprint.getPosition().getPoints())
                .sum();
    }

    /**
     * Assigns a TeamWithDriversDTO object with team and driver information.
     *
     * @param teamDrivers The list of team drivers.
     * @param team        The team for which the DTO is created.
     * @param totalPoints The total points for the team.
     * @return            The TeamWithDriversDTO object.
    */
    private TeamWithDriversDTO assignTeamWithDrivers(List<Driver> teamDrivers, Team team, int totalPoints) {
        TeamWithDriversDTO teamWithDrivers = new TeamWithDriversDTO();
        teamWithDrivers.setTeamDTO(teamMapper.teamToTeamDTOnoTeamImage(team));
        teamWithDrivers.setTotalPoints(totalPoints);

        teamWithDrivers.setDriver1(driverMapper.driverToDriverDTO(teamDrivers.get(0)));
        if (teamDrivers.size() > 1) {
            teamWithDrivers.setDriver2(driverMapper.driverToDriverDTO(teamDrivers.get(1)));
        }

        return teamWithDrivers;
    }
}
