package formula.bollo.app.impl;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Configuration;
import formula.bollo.app.mapper.ConfigurationMapper;
import formula.bollo.app.model.ConfigurationDTO;

@Component
public class ConfigurationImpl implements ConfigurationMapper {

     /**
     * Map ConfigurationDTO to return an object type Configuration
     * @param configurationDTO
     * @return class Configuration with ConfigurationDTO properties
    */
    @Override
    public Configuration configurationDTOToconfiguration(ConfigurationDTO configurationDTO) {
        Configuration conf = new Configuration();
        BeanUtils.copyProperties(configurationDTO, conf);

        return conf;
    }

      /**
     * Map Configuration to return an object type ConfigurationDTO
     * @param Configuration
     * @return class ConfigurationDTO with Configuration properties
    */

    @Override
    public ConfigurationDTO configurationToConfigurationDTO(Configuration configuration) {
        ConfigurationDTO conf = new ConfigurationDTO();
        BeanUtils.copyProperties(configuration, conf);

        return conf;
    }
    
}
