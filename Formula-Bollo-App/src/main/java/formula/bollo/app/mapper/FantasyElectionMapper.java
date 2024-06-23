package formula.bollo.app.mapper;

import org.springframework.stereotype.Component;

import formula.bollo.app.entity.FantasyElection;
import formula.bollo.app.model.FantasyElectionDTO;

@Component
public interface FantasyElectionMapper {
    FantasyElection fantasyElectionDTOToFantasyElection(FantasyElectionDTO fantasyElectionDTO);

    FantasyElectionDTO fantasyElectionToFantasyElectionDTO(FantasyElection fantasyElection);
}
