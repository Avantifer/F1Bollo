package formula.bollo.app.impl;

import java.sql.SQLException;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Penalty;
import formula.bollo.app.mapper.DriverMapper;
import formula.bollo.app.mapper.PenaltyMapper;
import formula.bollo.app.mapper.PenaltySeverityMapper;
import formula.bollo.app.mapper.RaceMapper;
import formula.bollo.app.model.PenaltyDTO;

@Component
public class PenaltyImpl implements PenaltyMapper {

    @Autowired
    private RaceMapper raceMapper;

    @Autowired
    private DriverMapper driverMapper;

    @Autowired
    private PenaltySeverityMapper penaltySeverityMapper;

    /**
     * Map PenaltyDTO to return an object type Penalty
     * @param penaltyDTO
     * @exception SQLException Cannot do something with the db
     * @exception IllegalArgumentException Cannot convert string to byte[]
     * @return class Penalty with PenaltyDTO properties
    */
    @Override
    public Penalty penaltyDTOToPenalty(PenaltyDTO penaltyDTO) {
        Penalty penalty = new Penalty();
        BeanUtils.copyProperties(penaltyDTO, penalty);
        penalty.setRace(raceMapper.raceDTOToRace(penaltyDTO.getRace()));
        penalty.setDriver(driverMapper.driverDTOToDriver(penaltyDTO.getDriver()));
        penalty.setSeverity(this.penaltySeverityMapper.penaltySeverityDTOToPenaltySeverity(penaltyDTO.getSeverity()));
        return penalty;
    }

    /**
     * Map Penalty to return an object type PenaltyDTO
     * @param penalty
     * @exception SQLException Cannot do something with the db
     * @exception IllegalArgumentException Cannot convert string to byte[]
     * @return class PenaltyDTO with Penalty properties
    */
    @Override
    public PenaltyDTO penaltyToPenaltyDTO(Penalty penalty) {
        PenaltyDTO penaltyDTO = new PenaltyDTO();
        BeanUtils.copyProperties(penalty, penaltyDTO);
        penaltyDTO.setRace(raceMapper.raceToRaceDTO(penalty.getRace()));
        penaltyDTO.setDriver(driverMapper.driverToDriverDTONoImage(penalty.getDriver()));
        penaltyDTO.setSeverity(this.penaltySeverityMapper.penaltySeverityToPenaltySeverityDTO(penalty.getSeverity()));
        return penaltyDTO;
    }
    
}
