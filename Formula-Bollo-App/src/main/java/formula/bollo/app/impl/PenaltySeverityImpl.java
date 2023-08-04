package formula.bollo.app.impl;


import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.PenaltySeverity;
import formula.bollo.app.mapper.PenaltySeverityMapper;
import formula.bollo.app.model.PenaltySeverityDTO;

@Component
public class PenaltySeverityImpl implements PenaltySeverityMapper{

    /**
     * Map PenaltySeverityDTO to return an object type PenaltySeverity
     * @param penaltySeverityDTO
     * @return class PenaltySeverity with PenaltySeverityDTO properties
    */
    @Override
    public PenaltySeverity penaltySeverityDTOToPenaltySeverity(PenaltySeverityDTO penaltySeverityDTO) {
        PenaltySeverity penaltySeverity = new PenaltySeverity();
        BeanUtils.copyProperties(penaltySeverityDTO, penaltySeverity);
        return penaltySeverity;
    }

    /**
     * Map PenaltySeverity to return an object type penaltySeverityDTO
     * @param penaltySeverity
     * @return class penaltySeverityDTO with PenaltySeverity properties
    */
    @Override
    public PenaltySeverityDTO penaltySeverityToPenaltySeverityDTO(PenaltySeverity penaltySeverity) {
       PenaltySeverityDTO penaltySeverityDTO = new PenaltySeverityDTO();
       BeanUtils.copyProperties(penaltySeverity, penaltySeverityDTO);
       return penaltySeverityDTO;
    }
    
}
