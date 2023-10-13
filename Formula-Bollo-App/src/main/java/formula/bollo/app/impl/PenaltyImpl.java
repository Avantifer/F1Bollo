package formula.bollo.app.impl;

import java.util.List;
import java.util.stream.Collectors;

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
     * Converts a PenaltyDTO object to a Penalty object.
     *
     * @param penaltyDTO The PenaltyDTO object to be converted.
     * @return           A Penalty object with properties copied from the PenaltyDTO.
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
     * Converts a Penalty object to a PenaltyDTO object.
     *
     * @param penalty The Penalty object to be converted.
     * @return        A PenaltyDTO object with properties copied from the Penalty.
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

    /**
     * Converts a list of Penalty objects to a list of PenaltyDTO objects.
     *
     * @param penalties The list of Penalty objects to be converted.
     * @return          A list of PenaltyDTO objects with properties copied from the Penalties.
    */
    @Override
    public List<PenaltyDTO> convertPenaltiesToPenaltiesDTO(List<Penalty> penalties) {
        return penalties.parallelStream()
                .map(this::penaltyToPenaltyDTO)
                .collect(Collectors.toList());
    }
}
