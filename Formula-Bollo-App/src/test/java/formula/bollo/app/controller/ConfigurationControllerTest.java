package formula.bollo.app.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.BEFORE_TEST_METHOD;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.SqlGroup;

import formula.bollo.app.FormulaBolloAppApplication;
import formula.bollo.app.model.ConfigurationDTO;
import formula.bollo.app.utils.Constants;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class ConfigurationControllerTest {
    
    @Autowired
    private ConfigurationController configurationController;

    @Test
    @DirtiesContext
    void getConfigurationsEmpty() {
        List<ConfigurationDTO> configurations =  this.configurationController.getAllConfigurations(1);
        assertNotNull(configurations);
        assertEquals(0, configurations.size());
        assertTrue(configurations.isEmpty());
    }

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/configuration/insertConfiguration.sql", executionPhase = BEFORE_TEST_METHOD)
    })   
    void getConfigurationsNotEmpty() {
        List<ConfigurationDTO> configurations =  this.configurationController.getAllConfigurations(null);
        assertNotNull(configurations);
        assertEquals(3, configurations.size());
        assertFalse(configurations.isEmpty());

        // Está igual porque está guardada en caché
        configurations = this.configurationController.getAllConfigurations(Constants.ACTUAL_SEASON);
        assertNotNull(configurations);
        assertEquals(3, configurations.size());
        assertFalse(configurations.isEmpty());
    }
}
