package formula.bollo.app.mapper;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Configuration;
import formula.bollo.app.model.ConfigurationDTO;

@Component
public interface ConfigurationMapper {
    
    ConfigurationMapper INSTANCE = Mappers.getMapper(ConfigurationMapper.class);

    Configuration configurationDTOToconfiguration(ConfigurationDTO configurationDTO);

    ConfigurationDTO configurationToConfigurationDTO(Configuration configuration);
}
