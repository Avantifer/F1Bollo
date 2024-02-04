package formula.bollo.app.mapper;

import java.util.List;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.FantasyElection;
import formula.bollo.app.model.FantasyElectionDTO;

@Component
public interface FantasyElectionMapper {
    
    FantasyElectionMapper INSTANCE = Mappers.getMapper(FantasyElectionMapper.class);

    FantasyElection fantasyElectionDTOToFantasyElection(FantasyElectionDTO fantasyElectionDTO);

    FantasyElectionDTO fantasyElectionToFantasyElectionDTO(FantasyElection fantasyElection);

    List<FantasyElectionDTO> convertFantasyElectionToFantasyElectionDTO(List<FantasyElection> fantasyElections);
}
