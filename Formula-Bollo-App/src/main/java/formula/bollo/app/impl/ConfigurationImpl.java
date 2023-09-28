package formula.bollo.app.impl;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Configuration;
import formula.bollo.app.mapper.ConfigurationMapper;
import formula.bollo.app.model.ConfigurationDTO;

@Component
public class ConfigurationImpl implements ConfigurationMapper {

    /**
     * Converts a ConfigurationDTO object to a Configuration object.
     *
     * @param configurationDTO The ConfigurationDTO object to be converted.
     * @return                 A Configuration object with properties copied from the ConfigurationDTO.
    */
    @Override
    public Configuration configurationDTOToconfiguration(ConfigurationDTO configurationDTO) {
        Configuration conf = new Configuration();
        BeanUtils.copyProperties(configurationDTO, conf);

        return conf;
    }

    /**
     * Converts a Configuration object to a ConfigurationDTO object.
     *
     * @param configuration The Configuration object to be converted.
     * @return              A ConfigurationDTO object with properties copied from the Configuration.
    */
    @Override
    public ConfigurationDTO configurationToConfigurationDTO(Configuration configuration) {
        ConfigurationDTO conf = new ConfigurationDTO();
        BeanUtils.copyProperties(configuration, conf);

        return conf;
    } 
}
