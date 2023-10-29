package formula.bollo.app.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;

import formula.bollo.app.entity.FantasyElection;
import formula.bollo.app.mapper.DriverMapper;
import formula.bollo.app.mapper.FantasyElectionMapper;
import formula.bollo.app.mapper.RaceMapper;
import formula.bollo.app.mapper.SeasonMapper;
import formula.bollo.app.mapper.TeamMapper;
import formula.bollo.app.model.FantasyElectionDTO;

public class FantasyElectionImpl implements FantasyElectionMapper {

    @Autowired
    private DriverMapper driverMapper;

    @Autowired
    private RaceMapper raceMapper;

    @Autowired
    private TeamMapper teamMapper;

    @Autowired
    private SeasonMapper seasonMapper;

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

        // Drivers mapping
        fantasyElection.setDriverHost(driverMapper.driverDTOToDriver(fantasyElectionDTO.getDriverHost()));
        fantasyElection.setDriverSelectedOne(driverMapper.driverDTOToDriver(fantasyElectionDTO.getDriverSelectedOne()));
        fantasyElection.setDriverSelectedTwo(driverMapper.driverDTOToDriver(fantasyElectionDTO.getDriverSelectedTwo()));
        fantasyElection.setDriverSelectedThree(driverMapper.driverDTOToDriver(fantasyElectionDTO.getDriverSelectedThree()));
        
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

        // Drivers Mapping
        fantasyElectionDTO.setDriverHost(driverMapper.driverToDriverDTO(fantasyElection.getDriverHost()));
        fantasyElectionDTO.setDriverSelectedOne(driverMapper.driverToDriverDTO(fantasyElection.getDriverHost()));
        fantasyElectionDTO.setDriverSelectedTwo(driverMapper.driverToDriverDTO(fantasyElection.getDriverSelectedOne()));
        fantasyElectionDTO.setDriverSelectedThree(driverMapper.driverToDriverDTO(fantasyElection.getDriverSelectedThree()));

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
