package formula.bollo.app.mapper;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Constructor;
import formula.bollo.app.model.ConstructorDTO;

@Component
public interface ConstructorMapper {
    
    ConstructorMapper INSTANCE = Mappers.getMapper(ConstructorMapper.class);

    Constructor constructorDTOToConstructor(ConstructorDTO circuitDTO);

    ConstructorDTO constructorToConstructorDTO(Constructor circuit);
}
