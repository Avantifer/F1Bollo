package formula.bollo.app.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import formula.bollo.app.model.ConfigurationDTO;
import formula.bollo.app.services.ConfigurationService;
import formula.bollo.app.utils.Constants;
import formula.bollo.app.utils.Log;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

@CrossOrigin(origins = Constants.URL_FRONTED)
@RestController
@RequestMapping(path = {Constants.ENDPOINT_CONFIGURATION}, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = Constants.TAG_CONFIGURATION, description = Constants.TAG_CONFIGURATION_SUMMARY)
public class ConfigurationController {

    @Autowired
    public ConfigurationService configurationService;

    private Map<Long, ConfigurationDTO> configurationsCache = new ConcurrentHashMap<>();

    @Operation(summary = "Get all configurations", tags = Constants.TAG_CONFIGURATION)
    @GetMapping("/all")
    public List<ConfigurationDTO> getAllConfigurations() {
        Log.info("START - getAllConfigurations - START");
        
        this.configurationService.putCircuitsOnCache(configurationsCache);

        Log.info("END - getAllConfigurations - END");
        return new ArrayList<>(configurationsCache.values());
    }
    
}
