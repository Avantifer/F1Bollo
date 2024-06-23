package formula.bollo.app.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Penalty;
import formula.bollo.app.model.PenaltyDTO;

@Component
public interface PenaltyMapper {
    Penalty penaltyDTOToPenalty(PenaltyDTO penaltyDTO);

    PenaltyDTO penaltyToPenaltyDTO(Penalty penalty);
    
    List<PenaltyDTO> convertPenaltiesToPenaltiesDTO(List<Penalty> penalties);
}
