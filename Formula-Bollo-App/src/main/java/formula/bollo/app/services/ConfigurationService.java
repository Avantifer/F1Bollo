package formula.bollo.app.services;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import formula.bollo.app.entity.Configuration;
import formula.bollo.app.mapper.ConfigurationMapper;
import formula.bollo.app.model.ConfigurationDTO;
import formula.bollo.app.repository.ConfigurationRepository;

@Service
public class ConfigurationService {

    @Autowired
    private ConfigurationRepository convConfigurationRepository;

    @Autowired
    private ConfigurationMapper configurationMapper;

    /**
     * Puts circuits into a cache if the cache is empty.
     *
     * @param cache The cache map where circuits are stored.
    */
    public void putCircuitsOnCache(Map<Long, ConfigurationDTO> cache) {
        if (!cache.isEmpty()) return;
        List<Configuration> configurations = convConfigurationRepository.findAll();
        
        Map<Long, ConfigurationDTO> configurationDTOMap = configurations.parallelStream()
                .collect(Collectors.toMap(Configuration::getId, configurationMapper::configurationToConfigurationDTO));

        cache.putAll(configurationDTOMap);
    }
}
