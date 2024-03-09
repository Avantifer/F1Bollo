package formula.bollo.app.impl;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Championship;
import formula.bollo.app.mapper.ChampionshipMapper;
import formula.bollo.app.mapper.DriverMapper;
import formula.bollo.app.mapper.SeasonMapper;
import formula.bollo.app.model.ChampionshipDTO;

@Component
public class ChampionshipImpl implements ChampionshipMapper {

    private DriverMapper driverMapper;
    private SeasonMapper seasonMapper;

    public ChampionshipImpl(DriverMapper driverMapper, SeasonMapper seasonMapper) {
        this.driverMapper = driverMapper;
        this.seasonMapper = seasonMapper;
    }
    /**
     * Converts a ChampionshipDTO object to a Championship object.
     *
     * @param championshipDTO The ChampionshipDTO object to be converted.
     * @return           A Championship object with properties copied from the ChampionshipDTO.
    */
    @Override
    public Championship championshipDTOToChampionship(ChampionshipDTO championshipDTO) {
        Championship championship = new Championship();
        BeanUtils.copyProperties(championshipDTO, championship);
        championship.setSeason(this.seasonMapper.seasonDTOToSeason(championshipDTO.getSeason()));
        championship.setDriver(this.driverMapper.driverDTOToDriver(championshipDTO.getDriver()));

        return championship;
    }

    /**
     * Converts a Championship object to a ChampionshipDTO object.
     *
     * @param championship The Championship object to be converted.
     * @return        A ChampionshipDTO object with properties copied from the Championship.
    */ 
    @Override
    public ChampionshipDTO championshipToChampionshipDTO(Championship championship) {
        ChampionshipDTO championshipDTO = new ChampionshipDTO();
        BeanUtils.copyProperties(championship, championshipDTO);
        championshipDTO.setSeason(this.seasonMapper.seasonToSeasonDTO(championship.getSeason()));
        championshipDTO.setDriver(this.driverMapper.driverToDriverDTO(championship.getDriver()));

        return championshipDTO;
    }
    
}
