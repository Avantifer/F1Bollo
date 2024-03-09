package formula.bollo.app.impl;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Constructor;
import formula.bollo.app.mapper.ConstructorMapper;
import formula.bollo.app.mapper.SeasonMapper;
import formula.bollo.app.mapper.TeamMapper;
import formula.bollo.app.model.ConstructorDTO;

@Component
public class ConstructorImpl implements ConstructorMapper {

    private TeamMapper teamMapper;
    private SeasonMapper seasonMapper;

    public ConstructorImpl(TeamMapper teamMapper, SeasonMapper seasonMapper) {
        this.teamMapper = teamMapper;
        this.seasonMapper = seasonMapper;
    }

    /**
     * Converts a ConstructorDTO object to a Constructor object.
     *
     * @param constructorDTO The ConstructorDTO object to be converted.
     * @return           A Constructor object with properties copied from the ConstructorDTO.
    */
    @Override
    public Constructor constructorDTOToConstructor(ConstructorDTO constructorDTO) {
        Constructor constructor = new Constructor();
        BeanUtils.copyProperties(constructorDTO, constructor);
        constructor.setSeason(this.seasonMapper.seasonDTOToSeason(constructorDTO.getSeason()));
        constructor.setTeam(this.teamMapper.teamDTOToTeam(constructorDTO.getTeam()));

        return constructor;
    }

    /**
     * Converts a Constructor object to a ConstructorDTO object.
     *
     * @param constructor The Constructor object to be converted.
     * @return        A ConstructorDTO object with properties copied from the Constructor.
    */ 
    @Override
    public ConstructorDTO constructorToConstructorDTO(Constructor constructor) {
        ConstructorDTO constructorDTO = new ConstructorDTO();
        BeanUtils.copyProperties(constructor, constructorDTO);
        constructorDTO.setSeason(this.seasonMapper.seasonToSeasonDTO(constructor.getSeason()));
        constructorDTO.setTeam(this.teamMapper.teamToTeamDTO(constructor.getTeam()));

        return constructorDTO;
    }
}
