package formula.bollo.app.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import formula.bollo.app.FormulaBolloAppApplication;
import formula.bollo.app.model.ConfigurationDTO;
import formula.bollo.app.model.SeasonDTO;
import nl.jqno.equalsverifier.EqualsVerifier;
import nl.jqno.equalsverifier.Warning;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class ConfigurationTest {
    
    @Test
    void testConfigurationAnnotations() {
        Season season = new Season();

        Configuration configuration = new Configuration();
        configuration.setId(1L);
        configuration.setSetting("MaxSpeed");
        configuration.setSettingValue("200");
        configuration.setSeason(season);

        // @Getter
        assertEquals(1L, configuration.getId());
        assertEquals("MaxSpeed", configuration.getSetting());
        assertEquals("200", configuration.getSettingValue());
        assertEquals(season, configuration.getSeason());

        // @Setter
        configuration.setSetting("MinSpeed");
        configuration.setSettingValue("50");

        assertEquals("MinSpeed", configuration.getSetting());
        assertEquals("50", configuration.getSettingValue());

        // @ToString
        String expectedToString = "Configuration(id=1, setting=MinSpeed, settingValue=50, season=" + season + ")";
        assertEquals(expectedToString, configuration.toString());

        // @AllArgsConstructor
        Configuration allArgsConfiguration = new Configuration(1L, "MinSpeed", "50", season);
        assertEquals(configuration, allArgsConfiguration);

        // @NoArgsConstructor
        Configuration noArgsConstructorConfiguration = new Configuration();
        assertNotNull(noArgsConstructorConfiguration);

        // @EqualsAndHashCode
        EqualsVerifier.forClass(Configuration.class).suppress(Warning.ALL_FIELDS_SHOULD_BE_USED).verify();
    }

    @Test
    void testConfigurationDTOAnnotations() {
        SeasonDTO seasonDTO = new SeasonDTO();

        ConfigurationDTO configurationDTO = new ConfigurationDTO();
        configurationDTO.setId(1L);
        configurationDTO.setSetting("MaxSpeed");
        configurationDTO.setSettingValue("200");
        configurationDTO.setSeason(seasonDTO);

        // @Getter
        assertEquals(1L, configurationDTO.getId());
        assertEquals("MaxSpeed", configurationDTO.getSetting());
        assertEquals("200", configurationDTO.getSettingValue());
        assertEquals(seasonDTO, configurationDTO.getSeason());

        // @Setter
        configurationDTO.setSetting("MinSpeed");
        configurationDTO.setSettingValue("50");

        assertEquals("MinSpeed", configurationDTO.getSetting());
        assertEquals("50", configurationDTO.getSettingValue());

        // @ToString
        String expectedToString = "ConfigurationDTO(id=1, setting=MinSpeed, settingValue=50, season=" + seasonDTO + ")";
        assertEquals(expectedToString, configurationDTO.toString());

        // @AllArgsConstructor
        ConfigurationDTO allArgsConfigurationDTO = new ConfigurationDTO(1L, "MinSpeed", "50", seasonDTO);
        assertEquals(configurationDTO, allArgsConfigurationDTO);

        // @NoArgsConstructor
        ConfigurationDTO noArgsConstructorConfigurationDTO = new ConfigurationDTO();
        assertNotNull(noArgsConstructorConfigurationDTO);

        // @EqualsAndHashCode
        EqualsVerifier.simple().forClass(ConfigurationDTO.class).verify();
    }
}
