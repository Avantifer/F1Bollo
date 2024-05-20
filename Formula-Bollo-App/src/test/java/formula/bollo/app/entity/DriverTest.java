package formula.bollo.app.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import formula.bollo.app.FormulaBolloAppApplication;
import formula.bollo.app.model.DriverDTO;
import formula.bollo.app.model.SeasonDTO;
import formula.bollo.app.model.TeamDTO;
import nl.jqno.equalsverifier.EqualsVerifier;
import nl.jqno.equalsverifier.Warning;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class DriverTest {
    
    @Test
    void testDriverAnnotations() {
        Team team = new Team();
        Season season = new Season();

        Driver driver = new Driver();
        driver.setId(1L);
        driver.setName("Lewis Hamilton");
        driver.setNumber(44);
        driver.setTeam(team);
        driver.setSeason(season);

        // @Getter
        assertEquals(1L, driver.getId());
        assertEquals("Lewis Hamilton", driver.getName());
        assertEquals(44, driver.getNumber());
        assertEquals(team, driver.getTeam());
        assertEquals(season, driver.getSeason());

        // @Setter
        Driver newDriver = new Driver();
        newDriver.setId(2L);
        newDriver.setName("Max Verstappen");
        newDriver.setNumber(33);
        newDriver.setTeam(team);
        newDriver.setSeason(season);

        assertEquals(2L, newDriver.getId());
        assertEquals("Max Verstappen", newDriver.getName());
        assertEquals(33, newDriver.getNumber());
        assertEquals(team, newDriver.getTeam());
        assertEquals(season, newDriver.getSeason());

        // @AllArgsConstructor
        Driver allArgsConstructor = new Driver(2L, "Max Verstappen", 33, team, null, season);
        assertEquals(newDriver, allArgsConstructor);

        // @NoArgsConstructor
        Driver noArgsConstructor = new Driver();
        assertNotNull(noArgsConstructor);

        // @EqualsAndHashCode
        EqualsVerifier.forClass(Driver.class).suppress(Warning.ALL_FIELDS_SHOULD_BE_USED).verify();
    }

    @Test
    void testDriverDTOAnnotations() {
        TeamDTO teamDTO = new TeamDTO();
        SeasonDTO seasonDTO = new SeasonDTO();

        DriverDTO driverDTO = new DriverDTO();
        driverDTO.setId(1L);
        driverDTO.setName("Lewis Hamilton");
        driverDTO.setNumber(44);
        driverDTO.setTeam(teamDTO);
        driverDTO.setSeason(seasonDTO);

        // @Getter
        assertEquals(1L, driverDTO.getId());
        assertEquals("Lewis Hamilton", driverDTO.getName());
        assertEquals(44, driverDTO.getNumber());
        assertEquals(teamDTO, driverDTO.getTeam());
        assertEquals(seasonDTO, driverDTO.getSeason());

        // @Setter
        DriverDTO newDriverDTO = new DriverDTO();
        newDriverDTO.setId(2L);
        newDriverDTO.setName("Max Verstappen");
        newDriverDTO.setNumber(33);
        newDriverDTO.setTeam(teamDTO);
        newDriverDTO.setSeason(seasonDTO);

        assertEquals(2L, newDriverDTO.getId());
        assertEquals("Max Verstappen", newDriverDTO.getName());
        assertEquals(33, newDriverDTO.getNumber());
        assertEquals(teamDTO, newDriverDTO.getTeam());
        assertEquals(seasonDTO, newDriverDTO.getSeason());

        // @AllArgsConstructor
        DriverDTO allArgsConstructorDTO = new DriverDTO(2L, "Max Verstappen", 33, teamDTO, null, seasonDTO);
        assertEquals(newDriverDTO, allArgsConstructorDTO);

        // @NoArgsConstructor
        DriverDTO noArgsConstructorDTO = new DriverDTO();
        assertNotNull(noArgsConstructorDTO);

        // @EqualsAndHashCode
        EqualsVerifier.simple().forClass(DriverDTO.class).verify();
    }
}
