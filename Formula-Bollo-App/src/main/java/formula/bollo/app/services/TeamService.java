package formula.bollo.app.services;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;

import formula.bollo.app.entity.Driver;
import formula.bollo.app.entity.Result;
import formula.bollo.app.entity.Sprint;
import formula.bollo.app.entity.Team;
import formula.bollo.app.mapper.DriverMapper;
import formula.bollo.app.mapper.TeamMapper;
import formula.bollo.app.model.DriverDTO;
import formula.bollo.app.model.TeamDTO;
import formula.bollo.app.model.TeamInfoDTO;
import formula.bollo.app.model.TeamWithDriversDTO;
import formula.bollo.app.repository.ChampionshipRepository;
import formula.bollo.app.repository.ConstructorRepository;
import formula.bollo.app.repository.DriverRepository;
import formula.bollo.app.repository.PenaltyRepository;
import formula.bollo.app.repository.ResultRepository;
import formula.bollo.app.repository.SprintRepository;
import formula.bollo.app.repository.TeamRepository;
import formula.bollo.app.utils.Constants;

@Service
public class TeamService {
 
    private final TeamRepository teamRepository;
    private final TeamMapper teamMapper;
    private final ResultRepository resultRepository;
    private final SprintRepository sprintRepository;
    private final DriverMapper driverMapper;
    private final DriverRepository driverRepository;
    private final ChampionshipRepository championshipRepository;
    private final ConstructorRepository constructorRepository;
    private final PenaltyRepository penaltyRepository;
    private final ResultService resultService;

    public TeamService(
        TeamRepository teamRepository, 
        TeamMapper teamMapper, 
        ResultRepository resultRepository, 
        SprintRepository sprintRepository, 
        DriverMapper driverMapper,
        DriverRepository driverRepository,
        ChampionshipRepository championshipRepository,
        ConstructorRepository constructorRepository,
        PenaltyRepository penaltyRepository,
        ResultService resultService
    ) {
        this.teamRepository = teamRepository;
        this.teamMapper = teamMapper;
        this.resultRepository = resultRepository;
        this.sprintRepository = sprintRepository;
        this.driverMapper = driverMapper;
        this.driverRepository = driverRepository;
        this.championshipRepository = championshipRepository;
        this.constructorRepository = constructorRepository;
        this.penaltyRepository = penaltyRepository;
        this.resultService = resultService;
    }

    /**
     * Puts teams into a cache if the cache is empty.
     *
     * @param cache The cache map where teams are stored.
    */
    public void putTeamsOnCache(Map<Long, TeamDTO> cache) {
        if (!cache.isEmpty()) return;

        List<Team> teams = teamRepository.findBySeason(Constants.ACTUAL_SEASON);

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
        teamWithDrivers.setTeamDTO(teamMapper.teamToTeamDTO(team));
        teamWithDrivers.setTotalPoints(totalPoints);

        teamWithDrivers.setDriver1(driverMapper.driverToDriverDTO(teamDrivers.get(0)));
        if (teamDrivers.size() > 1) {
            teamWithDrivers.setDriver2(driverMapper.driverToDriverDTO(teamDrivers.get(1)));
        }

        return teamWithDrivers;
    }


    /**
     * Returns a list of TeamDTO objects for a given season.
     *
     * @param season the season for which to retrieve teams
     * @return a list of TeamDTO objects
     */
    public List<TeamDTO> getTeamsBySeason(int season) {
        List<Team> teams = teamRepository.findBySeason(season);

        return teams.parallelStream()
            .map(teamMapper::teamToTeamDTO)
            .collect(Collectors.toList());
    }

    /**
     * Retrieves all type of info by the team name
     *
     * @param teams list of the teams with the name filter
    */ 
    public TeamInfoDTO getAllInfoTeam(List<Team> teams) {
        TeamInfoDTO teamInfoDTO = new TeamInfoDTO();

        List<Long> listOfIds = teams.stream().map(Team::getId).collect(Collectors.toList());
        TeamDTO teamDTO = teamMapper.teamToTeamDTO(teams.get(teams.size() - 1));
 
        int poles = 0;
        int fastlaps = 0;
        int racesFinished = 0;
        int totalPoints = 0;
        int championships = 0;
        int constructors = 0;
        int penalties = 0;
        int bestPosition = 0;
        int podiums = 0;
        int victories = 0;

        List<Result> results = new ArrayList<>(); 
        List<Sprint> sprints = new ArrayList<>();
        Map<DriverDTO, Integer> totalPointsByDriver = new HashMap<>();

        for(Long id : listOfIds) {
            List<Driver> drivers = this.driverRepository.findByTeam(id);
            List<Long> listOfIdsDrivers = drivers.stream().map(Driver::getId).collect(Collectors.toList());
            constructors += this.constructorRepository.findByTeamId(id).size();

            for(Long idDriver : listOfIdsDrivers) {
                poles += this.resultRepository.polesByDriverId(idDriver).size();
                fastlaps += this.resultRepository.fastlapByDriverId(idDriver).size();
                racesFinished += this.resultRepository.racesFinishedByDriverId(idDriver).size();
                championships += this.championshipRepository.findByDriverId(idDriver).size();
                penalties += this.penaltyRepository.findByDriverId(idDriver).size();
                podiums += this.resultRepository.podiumsOfDriver(id).size();
                victories += this.resultRepository.victoriesOfDriver(id).size();

                Optional<Result> bestResult = this.resultRepository.bestResultOfDriver(idDriver);
                if (bestResult.isPresent()) {
                    int currentPositionNumber = bestResult.get().getPosition().getPositionNumber();
                
                    if (bestPosition == 0 || bestPosition > currentPositionNumber) {
                        bestPosition = currentPositionNumber;
                    }
                }
                results.addAll(this.resultRepository.findByDriverId(idDriver));
                sprints.addAll(this.sprintRepository.findByDriverId(idDriver));
                resultService.setTotalPointsByDriver(results, sprints, totalPointsByDriver);
                Optional<Driver> driver = this.driverRepository.findById(idDriver);
                Integer pointsOfDriver = driver.isPresent() ? totalPointsByDriver.get(this.driverMapper.driverToDriverDTO(driver.get())) : null;
                if (pointsOfDriver == null) break;
                totalPoints +=  pointsOfDriver;

            }
        }
        
        teamInfoDTO.setTeam(teamDTO);
        teamInfoDTO.setPoles(poles);
        teamInfoDTO.setFastlaps(fastlaps);
        teamInfoDTO.setRacesFinished(racesFinished);
        teamInfoDTO.setTotalPoints(totalPoints);
        teamInfoDTO.setChampionships(championships);
        teamInfoDTO.setConstructors(constructors);
        teamInfoDTO.setPenalties(penalties);
        teamInfoDTO.setBestPosition(bestPosition);
        teamInfoDTO.setPodiums(podiums);
        teamInfoDTO.setVictories(victories);
        
        return teamInfoDTO;
    }

    public List<TeamInfoDTO> sumDuplicates(List<TeamInfoDTO> teamsInfoDTO) {
        Map<String, TeamInfoDTO> resultMap = new HashMap<>();
        
        for (TeamInfoDTO teamInfo : teamsInfoDTO) {
            String teamName = teamInfo.getTeam().getName();
            
            if (resultMap.containsKey(teamName)) {
                TeamInfoDTO existingTeamInfo = resultMap.get(teamName);
                existingTeamInfo.setTeam(teamInfo.getTeam());
                existingTeamInfo.setPoles(existingTeamInfo.getPoles() + teamInfo.getPoles());
                existingTeamInfo.setFastlaps(existingTeamInfo.getFastlaps() + teamInfo.getFastlaps());
                existingTeamInfo.setRacesFinished(existingTeamInfo.getRacesFinished() + teamInfo.getRacesFinished());
                existingTeamInfo.setTotalPoints(existingTeamInfo.getTotalPoints() + teamInfo.getTotalPoints());
                existingTeamInfo.setChampionships(existingTeamInfo.getChampionships() + teamInfo.getChampionships());
                existingTeamInfo.setPenalties(existingTeamInfo.getPenalties() + teamInfo.getPenalties());
                existingTeamInfo.setBestPosition(Math.max(existingTeamInfo.getBestPosition(), teamInfo.getBestPosition()));
                existingTeamInfo.setVictories(existingTeamInfo.getVictories() + teamInfo.getVictories());
                existingTeamInfo.setPodiums(existingTeamInfo.getPodiums() + teamInfo.getPodiums());
            } else {
                resultMap.put(teamName, teamInfo);
            }
        }
        
        return new ArrayList<>(resultMap.values());
    }
}
