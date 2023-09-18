package formula.bollo.app.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import formula.bollo.app.entity.Configuration;
import formula.bollo.app.mapper.ConfigurationMapper;
import formula.bollo.app.model.ConfigurationDTO;
import formula.bollo.app.repository.ConfigurationRepository;
import formula.bollo.app.utils.Log;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

@CrossOrigin(origins = "https://formulabollo.es")
@RestController
@RequestMapping(path = {"/configurations"}, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Configurations", description = "Operations related with Configurations")
public class ConfigurationController {

    @Autowired
    private ConfigurationRepository convConfigurationRepository;

    @Autowired
    private ConfigurationMapper configurationMapper;

    private Map<Long, ConfigurationDTO> configurationsCache = new ConcurrentHashMap<>();

    @Operation(summary = "Get all configurations", tags = "Configurations")
    @GetMapping("/all")
    public List<ConfigurationDTO> getAllConfigurations() {
        Log.info("START - getAllConfigurations - START");
        
        if (configurationsCache.isEmpty()) {
            List<Configuration> configurations = convConfigurationRepository.findAll();
            
            for(Configuration conf : configurations) {
                ConfigurationDTO configurationDTO = configurationMapper.configurationToConfigurationDTO(conf);
                configurationsCache.put(conf.getId(), configurationDTO);
            }
        }

        Log.info("END - getAllConfigurations - END");
        return new ArrayList<>(configurationsCache.values());
    }
    
}
