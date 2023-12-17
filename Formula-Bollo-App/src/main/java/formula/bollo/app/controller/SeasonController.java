package formula.bollo.app.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import formula.bollo.app.entity.Season;
import formula.bollo.app.mapper.SeasonMapper;
import formula.bollo.app.model.SeasonDTO;
import formula.bollo.app.repository.SeasonRepository;
import formula.bollo.app.utils.Constants;
import formula.bollo.app.utils.Log;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@CrossOrigin(origins = "http://192.168.1.135:4200")
@RestController
@RequestMapping(path = {Constants.ENDPOINT_SEASONS}, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = Constants.TAG_SEASON, description = Constants.TAG_SEASON_SUMMARY)
public class SeasonController {

    private SeasonRepository seasonRepository;
    private SeasonMapper seasonMapper;

    public SeasonController(SeasonRepository seasonRepository, SeasonMapper seasonMapper) {
        this.seasonRepository = seasonRepository;
        this.seasonMapper = seasonMapper;
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
}