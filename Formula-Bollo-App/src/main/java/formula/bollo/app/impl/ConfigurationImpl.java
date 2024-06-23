package formula.bollo.app.impl;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import formula.bollo.app.entity.Configuration;
import formula.bollo.app.mapper.ConfigurationMapper;
import formula.bollo.app.mapper.SeasonMapper;
import formula.bollo.app.model.ConfigurationDTO;

@Component
public class ConfigurationImpl implements ConfigurationMapper {

    private SeasonMapper seasonMapper;

    public ConfigurationImpl(SeasonMapper seasonMapper) {
        this.seasonMapper = seasonMapper;
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
        conf.setSeason(this.seasonMapper.seasonToSeasonDTO(configuration.getSeason()));

        return conf;
    } 
}
