package formula.bollo.app.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Penalty;
import formula.bollo.app.mapper.DriverMapper;
import formula.bollo.app.mapper.PenaltyMapper;
import formula.bollo.app.mapper.PenaltySeverityMapper;
import formula.bollo.app.mapper.RaceMapper;
import formula.bollo.app.mapper.SeasonMapper;
import formula.bollo.app.model.PenaltyDTO;

@Component
public class PenaltyImpl implements PenaltyMapper {

    private RaceMapper raceMapper;
    private DriverMapper driverMapper;
    private PenaltySeverityMapper penaltySeverityMapper;
    private SeasonMapper seasonMapper;

    public PenaltyImpl(
        RaceMapper raceMapper,
        DriverMapper driverMapper,
        PenaltySeverityMapper penaltySeverityMapper,
        SeasonMapper seasonMapper
    ) {
        this.raceMapper = raceMapper;
        this.driverMapper = driverMapper;
        this.penaltySeverityMapper = penaltySeverityMapper;
        this.seasonMapper = seasonMapper;
    }

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
        penalty.setSeason(this.seasonMapper.seasonDTOToSeason(penaltyDTO.getSeason()));
        
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
        penaltyDTO.setSeason(this.seasonMapper.seasonToSeasonDTO(penalty.getSeason()));

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
