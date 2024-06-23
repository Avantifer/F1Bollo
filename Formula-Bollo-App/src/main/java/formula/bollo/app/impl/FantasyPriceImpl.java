package formula.bollo.app.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.FantasyPriceDriver;
import formula.bollo.app.entity.FantasyPriceTeam;
import formula.bollo.app.mapper.DriverMapper;
import formula.bollo.app.mapper.FantasyPriceMapper;
import formula.bollo.app.mapper.RaceMapper;
import formula.bollo.app.mapper.SeasonMapper;
import formula.bollo.app.mapper.TeamMapper;
import formula.bollo.app.model.FantasyPriceDriverDTO;
import formula.bollo.app.model.FantasyPriceTeamDTO;

@Component
public class FantasyPriceImpl implements FantasyPriceMapper {
    
    private DriverMapper driverMapper;
    private RaceMapper raceMapper;
    private SeasonMapper seasonMapper;
    private TeamMapper teamMapper;

    public FantasyPriceImpl(
        DriverMapper driverMapper,
        RaceMapper raceMapper,
        SeasonMapper seasonMapper,
        TeamMapper teamMapper
    ) {
        this.driverMapper = driverMapper;
        this.raceMapper = raceMapper;
        this.seasonMapper = seasonMapper;
        this.teamMapper = teamMapper;
    }

    /**
     * Converts a FantasyPriceDriver object to a FantasyPriceDriverDTO object.
     *
     * @param fantasyPriceDriver The FantasyPriceDriver object to be converted.
     * @return       A FantasyPriceDriverDTO object with properties copied from the FantasyPriceDriver.
    */
    @Override
    public FantasyPriceDriverDTO fantasyPriceDriverToFantasyPriceDriverDTO(FantasyPriceDriver fantasyPriceDriver) {
        FantasyPriceDriverDTO fantasyPriceDriverDTO = new FantasyPriceDriverDTO();
        BeanUtils.copyProperties(fantasyPriceDriver, fantasyPriceDriverDTO);
        fantasyPriceDriverDTO.setPrice(fantasyPriceDriver.getPrice());
        fantasyPriceDriverDTO.setDriver(driverMapper.driverToDriverDTO(fantasyPriceDriver.getDriver()));
        fantasyPriceDriverDTO.setRace(raceMapper.raceToRaceDTO(fantasyPriceDriver.getRace()));
        fantasyPriceDriverDTO.setSeason(seasonMapper.seasonToSeasonDTO(fantasyPriceDriver.getSeason()));

        return fantasyPriceDriverDTO;
    }

    /**
     * Converts a list of FantasyPriceDriver objects to a list of FantasyPriceDriverDTO objects.
     *
     * @param fantasyPriceDrivers The list of FantasyPriceDriver objects to be converted.
     * @return        A list of FantasyPriceDriverDTO objects with properties copied from the FantasyPricesDriver.
    */
    @Override
    public List<FantasyPriceDriverDTO> convertFantasyPriceDriverToFantasyPriceDriverDTO(List<FantasyPriceDriver> fantasyPriceDrivers) {
        return fantasyPriceDrivers.parallelStream()
                .map(this::fantasyPriceDriverToFantasyPriceDriverDTO)
                .toList();
    }

    /**
     * Converts a FantasyPriceTeam object to a FantasyPriceTeamDTO object.
     *
     * @param fantasyPrice The FantasyPriceTeam object to be converted.
     * @return       A FantasyPriceTeamDTO object with properties copied from the fantasyPriceTeam.
    */
    @Override
    public FantasyPriceTeamDTO fantasyPriceTeamToFantasyPriceTeamDTO(FantasyPriceTeam fantasyPriceTeam) {
        FantasyPriceTeamDTO fantasyPriceTeamDTO = new FantasyPriceTeamDTO();
        BeanUtils.copyProperties(fantasyPriceTeam, fantasyPriceTeamDTO);

        fantasyPriceTeamDTO.setPrice(fantasyPriceTeam.getPrice());
        fantasyPriceTeamDTO.setTeam(teamMapper.teamToTeamDTO(fantasyPriceTeam.getTeam()));
        fantasyPriceTeamDTO.setRace(raceMapper.raceToRaceDTO(fantasyPriceTeam.getRace()));
        fantasyPriceTeamDTO.setSeason(seasonMapper.seasonToSeasonDTO(fantasyPriceTeam.getSeason()));

        return fantasyPriceTeamDTO;
    }

    /**
     * Converts a list of FantasyPriceTeam objects to a list of FantasyPriceTeamDTO objects.
     *
     * @param fantasyPrices The list of FantasyPriceTeam objects to be converted.
     * @return        A list of FantasyPriceTeamDTO objects with properties copied from the FantasyPricesTeam.
    */
    @Override
    public List<FantasyPriceTeamDTO> convertFantasyPriceTeamToFantasyPriceTeamDTO(List<FantasyPriceTeam> fantasyPriceTeams) {
        return fantasyPriceTeams.parallelStream()
                .map(this::fantasyPriceTeamToFantasyPriceTeamDTO)
                .collect(Collectors.toList());
    }
}
