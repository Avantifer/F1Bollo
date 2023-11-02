package formula.bollo.app.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;

import formula.bollo.app.entity.FantasyElection;
import formula.bollo.app.mapper.DriverMapper;
import formula.bollo.app.mapper.FantasyElectionMapper;
import formula.bollo.app.mapper.RaceMapper;
import formula.bollo.app.mapper.SeasonMapper;
import formula.bollo.app.mapper.TeamMapper;
import formula.bollo.app.mapper.UserMapper;
import formula.bollo.app.model.FantasyElectionDTO;

public class FantasyElectionImpl implements FantasyElectionMapper {

    private DriverMapper driverMapper;
    private RaceMapper raceMapper;
    private TeamMapper teamMapper;
    private SeasonMapper seasonMapper;
    private UserMapper userMapper;

    public FantasyElectionImpl(
        DriverMapper driverMapper,
        RaceMapper raceMapper,
        TeamMapper teamMapper,
        SeasonMapper seasonMapper,
        UserMapper userMapper
    ) {
        this.driverMapper = driverMapper;
        this.raceMapper = raceMapper;
        this.teamMapper = teamMapper;
        this.seasonMapper = seasonMapper;
        this.userMapper = userMapper;
    }

    /**
     * Converts a FantasyElectoinDTO object to a FantasyElection object.
     *
     * @param fantasyElectionDTO The FantasyElectionDTO object to be converted.
     * @return          A FantasyElection object with properties copied from the FantasyElectionDTO.
    */
    @Override
    public FantasyElection fantasyElectionDTOToFantasyElection(FantasyElectionDTO fantasyElectionDTO) {
        FantasyElection fantasyElection = new FantasyElection();
        BeanUtils.copyProperties(fantasyElectionDTO, fantasyElection);
        fantasyElection.setUser(userMapper.userDTOToUser(fantasyElectionDTO.getUser()));

        // Drivers mapping
        fantasyElection.setDriverOne(driverMapper.driverDTOToDriver(fantasyElectionDTO.getDriverOne()));
        fantasyElection.setDriverTwo(driverMapper.driverDTOToDriver(fantasyElectionDTO.getDriverTwo()));
        fantasyElection.setDriverThree(driverMapper.driverDTOToDriver(fantasyElectionDTO.getDriverThree()));
        
        // Race, season and team mapping
        fantasyElection.setRace(raceMapper.raceDTOToRace(fantasyElectionDTO.getRace()));
        fantasyElection.setSeason(seasonMapper.seasonDTOToSeason(fantasyElectionDTO.getSeason()));
        fantasyElection.setTeam(teamMapper.teamDTOToTeam(fantasyElectionDTO.getTeam()));

        return fantasyElection;
    }

    /**
     * Converts a FantasyElection object to a FantasyElectionDTO object.
     *
     * @param fantasyElection The FantasyElection object to be converted.
     * @return       A FantasyElectionDTO object with properties copied from the v.
    */
    @Override
    public FantasyElectionDTO fantasyElectionToFantasyElectionDTO(FantasyElection fantasyElection) {
        FantasyElectionDTO fantasyElectionDTO = new FantasyElectionDTO();
        BeanUtils.copyProperties(fantasyElection, fantasyElectionDTO);
        fantasyElectionDTO.setUser(userMapper.userToUserDTO(fantasyElection.getUser()));

        // Drivers Mapping
        fantasyElectionDTO.setDriverOne(driverMapper.driverToDriverDTO(fantasyElection.getDriverOne()));
        fantasyElectionDTO.setDriverTwo(driverMapper.driverToDriverDTO(fantasyElection.getDriverTwo()));
        fantasyElectionDTO.setDriverThree(driverMapper.driverToDriverDTO(fantasyElection.getDriverThree()));

        // Race, season and team mapping
        fantasyElectionDTO.setRace(raceMapper.raceToRaceDTO(fantasyElection.getRace()));
        fantasyElectionDTO.setSeason(seasonMapper.seasonToSeasonDTO(fantasyElection.getSeason()));
        fantasyElectionDTO.setTeam(teamMapper.teamToTeamDTO(fantasyElection.getTeam()));

        return fantasyElectionDTO;
    }

    /**
     * Converts a list of FantasyElection objects to a list of FantasyElectionDTO objects.
     *
     * @param fantasyElections The list of FantasyElection objects to be converted.
     * @return        A list of FantasyElectionDTO objects with properties copied from the FantasyElections.
    */
    @Override
    public List<FantasyElectionDTO> convertFantasyElectionToFantasyElectionDTO(List<FantasyElection> fantasyElections) {
        return fantasyElections.parallelStream()
                .map(this::fantasyElectionToFantasyElectionDTO)
                .collect(Collectors.toList());
    }
    
}
