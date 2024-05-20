package formula.bollo.app.mapper;

import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Configuration;
import formula.bollo.app.model.ConfigurationDTO;

@Component
public interface ConfigurationMapper {
    ConfigurationDTO configurationToConfigurationDTO(Configuration configuration);
}
