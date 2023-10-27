package formula.bollo.app.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Season;
import formula.bollo.app.mapper.SeasonMapper;
import formula.bollo.app.model.SeasonDTO;

@Component
public class SeasonImpl implements SeasonMapper{
    
    /**
     * Converts a SeasonDTO object to a Season object.
     *
     * @param seasonDTO The SeasonDTO object to be converted.
     * @return        A Season object with properties copied from the SeasonDTO.
    */
    @Override
    public Season seasonDTOToSeason(SeasonDTO seasonDTO) {
        Season season = new Season();
        if (seasonDTO != null) {
            BeanUtils.copyProperties(seasonDTO, season);
        }
        return season;
    }

    /**
     * Converts a Season object to a SeasonDTO object.
     *
     * @param season The Season object to be converted.
     * @return     A SeasonDTO object with properties copied from the Season.
    */
    @Override
    public SeasonDTO seasonToSeasonDTO(Season season) {
        SeasonDTO seasonDTO = new SeasonDTO();
        BeanUtils.copyProperties(season, seasonDTO);
        return seasonDTO;
    }

    /**
     * Converts a list of Race objects to a list of RaceDTO objects.
     *
     * @param races The list of Race objects to be converted.
     * @return      A list of RaceDTO objects with properties copied from the Races.
    */
    @Override
    public List<SeasonDTO> convertSeasonsToSeasonsDTO(List<Season> seasons) {
        return seasons.parallelStream()
                .map(this::seasonToSeasonDTO)
                .collect(Collectors.toList());
    }
}
