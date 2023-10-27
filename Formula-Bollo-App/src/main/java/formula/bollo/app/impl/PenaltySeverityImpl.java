package formula.bollo.app.impl;


import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.PenaltySeverity;
import formula.bollo.app.mapper.PenaltySeverityMapper;
import formula.bollo.app.model.PenaltySeverityDTO;

@Component
public class PenaltySeverityImpl implements PenaltySeverityMapper{

    /**
     * Converts a PenaltySeverityDTO object to a PenaltySeverity object.
     *
     * @param penaltySeverityDTO The PenaltySeverityDTO object to be converted.
     * @return                   A PenaltySeverity object with properties copied from the PenaltySeverityDTO.
    */
    @Override
    public PenaltySeverity penaltySeverityDTOToPenaltySeverity(PenaltySeverityDTO penaltySeverityDTO) {
        PenaltySeverity penaltySeverity = new PenaltySeverity();
        BeanUtils.copyProperties(penaltySeverityDTO, penaltySeverity);
        return penaltySeverity;
    }
    /**
     * Converts a PenaltySeverity object to a PenaltySeverityDTO object.
     *
     * @param penaltySeverity The PenaltySeverity object to be converted.
     * @return                A PenaltySeverityDTO object with properties copied from the PenaltySeverity.
    */
    @Override
    public PenaltySeverityDTO penaltySeverityToPenaltySeverityDTO(PenaltySeverity penaltySeverity) {
       PenaltySeverityDTO penaltySeverityDTO = new PenaltySeverityDTO();
       BeanUtils.copyProperties(penaltySeverity, penaltySeverityDTO);
       return penaltySeverityDTO;
    }

    /**
     * Converts a list of PenaltySeverity objects to a list of PenaltySeverityDTO objects.
     *
     * @param penaltiesSeverities The list of PenaltySeverity objects to be converted.
     * @return                    A list of PenaltySeverityDTO objects with properties copied from the PenaltySeverities.
    */
    @Override
    public List<PenaltySeverityDTO> convertPenaltiesSeverityToPenaltiesSeverityDTO(List<PenaltySeverity> penaltiesSeverities) {
        return penaltiesSeverities.parallelStream()
                .map(this::penaltySeverityToPenaltySeverityDTO)
                .collect(Collectors.toList());
    }
}
