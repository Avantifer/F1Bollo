package formula.bollo.app.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.FantasyPointsDriver;
import formula.bollo.app.entity.FantasyPointsTeam;
import formula.bollo.app.mapper.DriverMapper;
import formula.bollo.app.mapper.FantasyPointsMapper;
import formula.bollo.app.mapper.RaceMapper;
import formula.bollo.app.mapper.SeasonMapper;
import formula.bollo.app.mapper.TeamMapper;
import formula.bollo.app.model.FantasyPointsDriverDTO;
import formula.bollo.app.model.FantasyPointsTeamDTO;

@Component
public class FantasyPointsImpl implements FantasyPointsMapper {
    
    private DriverMapper driverMapper;
    private TeamMapper teamMapper;
    private RaceMapper raceMapper;
    private SeasonMapper seasonMapper;

    public FantasyPointsImpl(
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
     * Converts a FantasyPointsDriverDTO object to a fantasyPointsDriver object.
     *
     * @param fantasyPointsDriverDTO The fantasyPointsDriverDTO object to be converted.
     * @return          A fantasyPointsDriver object with properties copied from the fantasyPointsDriverDTO.
    */
    @Override
    public FantasyPointsDriver fantasyPointsDriverDTOToFantasyPointsDriver(FantasyPointsDriverDTO fantasyPointsDriverDTO) {
        FantasyPointsDriver fantasyPointsDriver = new FantasyPointsDriver();
        BeanUtils.copyProperties(fantasyPointsDriverDTO, fantasyPointsDriver);

        fantasyPointsDriver.setDriver(driverMapper.driverDTOToDriver(fantasyPointsDriverDTO.getDriver()));
        fantasyPointsDriver.setRace(raceMapper.raceDTOToRace(fantasyPointsDriverDTO.getRace()));
        fantasyPointsDriver.setSeason(seasonMapper.seasonDTOToSeason(fantasyPointsDriverDTO.getSeason()));

        return fantasyPointsDriver;
    }

    /**
     * Converts a FantasyPointsDriver object to a FantasyPointsDriverDTO object.
     *
     * @param fantasyPointsDriver The FantasyPointsDriver object to be converted.
     * @return       A FantasyPointsDriverDTO object with properties copied from the fantasyPointsDriver.
    */
    @Override
    public FantasyPointsDriverDTO fantasyPointsDriverToFantasyPointsDriverDTO(FantasyPointsDriver fantasyPointsDriver) {
        FantasyPointsDriverDTO fantasyPointsDriverDTO = new FantasyPointsDriverDTO();
        BeanUtils.copyProperties(fantasyPointsDriver, fantasyPointsDriverDTO);

        fantasyPointsDriverDTO.setDriver(driverMapper.driverToDriverDTO(fantasyPointsDriver.getDriver()));
        fantasyPointsDriverDTO.setRace(raceMapper.raceToRaceDTO(fantasyPointsDriver.getRace()));
        fantasyPointsDriverDTO.setSeason(seasonMapper.seasonToSeasonDTO(fantasyPointsDriver.getSeason()));

        return fantasyPointsDriverDTO;
    }

    /**
     * Converts a list of FantasyPointsDriver objects to a list of FantasyPointsDriverDTO objects.
     *
     * @param fantasyPointsDrivers The list of FantasyPointsDriver objects to be converted.
     * @return        A list of FantasyPointsDriverDTO objects with properties copied from the FantasyPointsDriver.
    */
    @Override
    public List<FantasyPointsDriverDTO> convertFantasyPointsDriverToFantasyPointsDriverDTO(List<FantasyPointsDriver> fantasyPointsDrivers) {
        return fantasyPointsDrivers.parallelStream()
                .map(this::fantasyPointsDriverToFantasyPointsDriverDTO)
                .toList();
    }

    /**
     * Converts a FantasyPointsTeamDTO object to a FantasyPointsTeam object.
     *
     * @param fantasyPointsTeamDTO The fantasyPointsTeamDTO object to be converted.
     * @return          A fantasyPointsDriver object with properties copied from the fantasyPointsTeamDTO.
    */
    @Override
    public FantasyPointsTeam fantasyPointsTeamDTOToFantasyPointsTeam(FantasyPointsTeamDTO fantasyPointsTeamDTO) {
        FantasyPointsTeam fantasyPointsTeam = new FantasyPointsTeam();
        BeanUtils.copyProperties(fantasyPointsTeamDTO, fantasyPointsTeam);

        fantasyPointsTeam.setTeam(teamMapper.teamDTOToTeam(fantasyPointsTeamDTO.getTeam()));
        fantasyPointsTeam.setRace(raceMapper.raceDTOToRace(fantasyPointsTeamDTO.getRace()));
        fantasyPointsTeam.setSeason(seasonMapper.seasonDTOToSeason(fantasyPointsTeamDTO.getSeason()));

        return fantasyPointsTeam;
    }

    /**
     * Converts a FantasyPointsTeam object to a FantasyPointsTeamDTO object.
     *
     * @param fantasyPointsTeam The FantasyPointsTeam object to be converted.
     * @return       A FantasyPointsTeamDTO object with properties copied from the FantasyPointsTeam.
    */
    @Override
    public FantasyPointsTeamDTO fantasyPointsTeamToFantasyPointsTeamDTO(FantasyPointsTeam fantasyPointsTeam) {
        FantasyPointsTeamDTO fantasyPointsTeamDTO = new FantasyPointsTeamDTO();
        BeanUtils.copyProperties(fantasyPointsTeam, fantasyPointsTeamDTO);

        fantasyPointsTeamDTO.setTeam(teamMapper.teamToTeamDTO(fantasyPointsTeam.getTeam()));
        fantasyPointsTeamDTO.setRace(raceMapper.raceToRaceDTO(fantasyPointsTeam.getRace()));
        fantasyPointsTeamDTO.setSeason(seasonMapper.seasonToSeasonDTO(fantasyPointsTeam.getSeason()));

        return fantasyPointsTeamDTO;
    }

    /**
     * Converts a list of FantasyPointsTeam objects to a list of FantasyPointsTeamDTO objects.
     *
     * @param fantasyPointsTeams The list of FantasyPointsTeam objects to be converted.
     * @return        A list of FantasyPointsTeamDTO objects with properties copied from the FantasyPointsTeam.
    */
    @Override
    public List<FantasyPointsTeamDTO> convertFantasyPointsTeamToFantasyPointsTeamDTO(List<FantasyPointsTeam> fantasyPointsTeams) {
        return fantasyPointsTeams.parallelStream()
                .map(this::fantasyPointsTeamToFantasyPointsTeamDTO)
                .collect(Collectors.toList());
    }
}
