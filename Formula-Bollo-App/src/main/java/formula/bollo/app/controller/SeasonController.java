package formula.bollo.app.controller;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import formula.bollo.app.entity.Driver;
import formula.bollo.app.entity.FantasyElection;
import formula.bollo.app.entity.Season;
import formula.bollo.app.entity.Team;
import formula.bollo.app.mapper.SeasonMapper;
import formula.bollo.app.model.SeasonDTO;
import formula.bollo.app.repository.DriverRepository;
import formula.bollo.app.repository.FantasyElectionRepository;
import formula.bollo.app.repository.SeasonRepository;
import formula.bollo.app.repository.TeamRepository;
import formula.bollo.app.utils.Constants;
import formula.bollo.app.utils.Log;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@CrossOrigin(origins = Constants.PRODUCTION_FRONTEND)
@RestController
@RequestMapping(path = {Constants.ENDPOINT_SEASONS}, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = Constants.TAG_SEASON, description = Constants.TAG_SEASON_SUMMARY)
public class SeasonController {

    private SeasonRepository seasonRepository;
    private SeasonMapper seasonMapper;
    private DriverRepository driverRepository;
    private TeamRepository teamRepository;
    private FantasyElectionRepository fantasyElectionRepository;

    public SeasonController(
        SeasonRepository seasonRepository,
        SeasonMapper seasonMapper,
        DriverRepository driverRepository,
        TeamRepository teamRepository,
        FantasyElectionRepository fantasyElectionRepository
    ) {
        this.seasonRepository = seasonRepository;
        this.seasonMapper = seasonMapper;
        this.driverRepository = driverRepository;
        this.teamRepository = teamRepository;
        this.fantasyElectionRepository = fantasyElectionRepository;
    }

    @Operation(summary = "Get all seasons", tags = Constants.TAG_SEASON)
    @GetMapping("/all")
    public List<SeasonDTO> getAllSeasons() {
        Log.info("START - getAllSeasons - START");
        
        List<SeasonDTO> seasons = this.seasonMapper.convertSeasonsToSeasonsDTO(this.seasonRepository.findAll());

        Log.info("END - getAllSeasons - END");
        return seasons;
    }

    @Operation(summary = "Get actual season", tags = Constants.TAG_SEASON)
    @GetMapping("/actual")
    public SeasonDTO getActualSeason() {
        Log.info("START - getActualSeason - START");
        
        SeasonDTO season = new SeasonDTO();
        List<Season> seasons = this.seasonRepository.findByNumber(Constants.ACTUAL_SEASON);

        if (seasons.isEmpty()) return season;
        season = this.seasonMapper.seasonToSeasonDTO(seasons.get(0));

        Log.info("END - getActualSeason - END");
        return season;
    }

    @Operation(summary = "Get seasons by Driver's Name", tags = Constants.TAG_SEASON)
    @GetMapping("/byDriverName")
    public List<SeasonDTO> seasonsByDriverName(String driverName) {
        Log.info("START - seasonsByDriverName - START");
        
        List<SeasonDTO> seasons = new ArrayList<>();
        List<Driver> drivers = this.driverRepository.findByName(driverName);

        if (drivers.isEmpty()) return seasons;
          
        for (Driver driver : drivers) {
            seasons.add(this.seasonMapper.seasonToSeasonDTO(driver.getSeason()));
        }

        Log.info("END - seasonsByDriverName - END");
        return seasons;
    }

    @Operation(summary = "Get seasons by Team's Name", tags = Constants.TAG_SEASON)
    @GetMapping("/byTeamName")
    public List<SeasonDTO> seasonsByTeamName(String teamName) {
        Log.info("START - seasonsByTeamName - START");
        
        List<SeasonDTO> seasons = new ArrayList<>();
        List<Team> teams = this.teamRepository.findByName(teamName);

        if (teams.isEmpty()) return seasons;
          
        for (Team team : teams) {
            seasons.add(this.seasonMapper.seasonToSeasonDTO(team.getSeason()));
        }

        Log.info("END - seasonsByTeamName - END");
        return seasons;
    }

    @Operation(summary = "Get seasons of fantasy", tags = Constants.TAG_SEASON)
    @GetMapping("/fantasy")
    public List<SeasonDTO> seasonsByTeamName() {
        Log.info("START - seasonsByTeamName - START");
        
        Set<Season> seasons;
        List<FantasyElection> fantasyElections = this.fantasyElectionRepository.findAll();
        List<Season> fSeasonDTOs = fantasyElections.stream().map(FantasyElection::getSeason).toList();

        seasons = new HashSet<>(fSeasonDTOs);
        List<SeasonDTO> seasonsReturn = seasons.stream().map(seasonMapper::seasonToSeasonDTO).collect(Collectors.toList());
        seasonsReturn.sort(Comparator.comparingLong(SeasonDTO::getId));
        
        if (seasons.isEmpty()) return seasonsReturn;

        Log.info("END - seasonsByTeamName - END");
        return seasonsReturn;
    }

}