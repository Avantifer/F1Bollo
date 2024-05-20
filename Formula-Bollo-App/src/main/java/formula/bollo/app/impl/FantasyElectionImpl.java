package formula.bollo.app.impl;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.FantasyElection;
import formula.bollo.app.mapper.DriverMapper;
import formula.bollo.app.mapper.FantasyElectionMapper;
import formula.bollo.app.mapper.RaceMapper;
import formula.bollo.app.mapper.SeasonMapper;
import formula.bollo.app.mapper.TeamMapper;
import formula.bollo.app.mapper.AccountMapper;
import formula.bollo.app.model.FantasyElectionDTO;

@Component
public class FantasyElectionImpl implements FantasyElectionMapper {

    private DriverMapper driverMapper;
    private RaceMapper raceMapper;
    private TeamMapper teamMapper;
    private SeasonMapper seasonMapper;
    private AccountMapper accountMapper;

    public FantasyElectionImpl(
        DriverMapper driverMapper,
        RaceMapper raceMapper,
        TeamMapper teamMapper,
        SeasonMapper seasonMapper,
        AccountMapper accountMapper
    ) {
        this.driverMapper = driverMapper;
        this.raceMapper = raceMapper;
        this.teamMapper = teamMapper;
        this.seasonMapper = seasonMapper;
        this.accountMapper = accountMapper;
    }

    /**
     * Converts a FantasyElectionDTO object to a FantasyElection object.
     *
     * @param fantasyElectionDTO The FantasyElectionDTO object to be converted.
     * @return          A FantasyElection object with properties copied from the FantasyElectionDTO.
    */
    @Override
    public FantasyElection fantasyElectionDTOToFantasyElection(FantasyElectionDTO fantasyElectionDTO) {
        FantasyElection fantasyElection = new FantasyElection();
        BeanUtils.copyProperties(fantasyElectionDTO, fantasyElection);
        fantasyElection.setUser(accountMapper.accountDTOToAccount(fantasyElectionDTO.getUser()));

        // Drivers mapping
        fantasyElection.setDriverOne(driverMapper.driverDTOToDriver(fantasyElectionDTO.getDriverOne()));
        fantasyElection.setDriverTwo(driverMapper.driverDTOToDriver(fantasyElectionDTO.getDriverTwo()));
        fantasyElection.setDriverThree(driverMapper.driverDTOToDriver(fantasyElectionDTO.getDriverThree()));
        
        // Teams mapping
        fantasyElection.setTeamOne(teamMapper.teamDTOToTeam(fantasyElectionDTO.getTeamOne()));
        fantasyElection.setTeamTwo(teamMapper.teamDTOToTeam(fantasyElectionDTO.getTeamTwo()));

        // Race and season mapping
        fantasyElection.setRace(raceMapper.raceDTOToRace(fantasyElectionDTO.getRace()));
        fantasyElection.setSeason(seasonMapper.seasonDTOToSeason(fantasyElectionDTO.getSeason()));

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
        fantasyElectionDTO.setUser(accountMapper.accountToAccountDTO(fantasyElection.getUser()));

        // Drivers mapping
        fantasyElectionDTO.setDriverOne(driverMapper.driverToDriverDTO(fantasyElection.getDriverOne()));
        fantasyElectionDTO.setDriverTwo(driverMapper.driverToDriverDTO(fantasyElection.getDriverTwo()));
        fantasyElectionDTO.setDriverThree(driverMapper.driverToDriverDTO(fantasyElection.getDriverThree()));

        // Teams mapping
        fantasyElectionDTO.setTeamOne(teamMapper.teamToTeamDTO(fantasyElection.getTeamOne()));
        fantasyElectionDTO.setTeamTwo(teamMapper.teamToTeamDTO(fantasyElection.getTeamTwo()));

        // Race and season mapping
        fantasyElectionDTO.setRace(raceMapper.raceToRaceDTO(fantasyElection.getRace()));
        fantasyElectionDTO.setSeason(seasonMapper.seasonToSeasonDTO(fantasyElection.getSeason()));

        return fantasyElectionDTO;
    }    
}
