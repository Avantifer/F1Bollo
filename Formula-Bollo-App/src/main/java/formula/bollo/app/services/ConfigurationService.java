package formula.bollo.app.services;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import formula.bollo.app.entity.Configuration;
import formula.bollo.app.mapper.ConfigurationMapper;
import formula.bollo.app.model.ConfigurationDTO;
import formula.bollo.app.repository.ConfigurationRepository;

@Service
public class ConfigurationService {

    private final ConfigurationRepository configurationRepository;

    private final ConfigurationMapper configurationMapper;

    public ConfigurationService(ConfigurationRepository configurationRepository, ConfigurationMapper configurationMapper) {
        this.configurationRepository = configurationRepository;
        this.configurationMapper = configurationMapper;
    }

    /**
     * Puts circuits into a cache if the cache is empty.
     *
     * @param cache The cache map where circuits are stored.
    */
    public void putCircuitsOnCache(Map<Long, ConfigurationDTO> cache) {
        if (!cache.isEmpty()) return;
        List<Configuration> configurations = configurationRepository.findAll();
        
        Map<Long, ConfigurationDTO> configurationDTOMap = configurations.parallelStream()
                .collect(Collectors.toMap(Configuration::getId, configurationMapper::configurationToConfigurationDTO));

        cache.putAll(configurationDTOMap);
    }

    /**
     * Retrieves a list of configuration data for a specific season.
     *
     * @param season The season for which circuit data is requested.
     * @return A list of ConfigurationDTO objects representing the configuration of the specified season.
    */
    public List<ConfigurationDTO> getCircuitsSeason(int season) {
        List<Configuration> circuits = configurationRepository.findBySeason(season);

        return circuits.parallelStream()
            .map(configurationMapper::configurationToConfigurationDTO)
            .collect(Collectors.toList());
    }
}
