package formula.bollo.app.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import formula.bollo.app.entity.PenaltySeverity;
import formula.bollo.app.model.PenaltySeverityDTO;

@Component
public interface PenaltySeverityMapper {
    PenaltySeverity penaltySeverityDTOToPenaltySeverity(PenaltySeverityDTO penaltySeverityDTO);

    PenaltySeverityDTO penaltySeverityToPenaltySeverityDTO(PenaltySeverity penaltySeverity);

    List<PenaltySeverityDTO> convertPenaltiesSeverityToPenaltiesSeverityDTO(List<PenaltySeverity> penaltiesSeverities);
}
