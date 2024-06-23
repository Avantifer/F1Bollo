package formula.bollo.app.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import formula.bollo.app.FormulaBolloAppApplication;
import formula.bollo.app.model.ChampionshipDTO;
import formula.bollo.app.model.DriverDTO;
import formula.bollo.app.model.SeasonDTO;
import formula.bollo.app.model.TeamDTO;
import nl.jqno.equalsverifier.EqualsVerifier;
import nl.jqno.equalsverifier.Warning;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class ChampionshipTest {
    
    @Test
    void testChampionshipAnnotations() {
        Driver driver = new Driver();  // Asegúrate de inicializar con los valores necesarios
        Season season = new Season();  // Asegúrate de inicializar con los valores necesarios

        Championship championship = new Championship();
        championship.setId(1L);
        championship.setDriver(driver);
        championship.setSeason(season);

        // @Getter
        assertEquals(1L, championship.getId());
        assertEquals(driver, championship.getDriver());
        assertEquals(season, championship.getSeason());

        // @Setter
        Driver newDriver = new Driver();  // Asegúrate de inicializar con los valores necesarios
        Season newSeason = new Season();  // Asegúrate de inicializar con los valores necesarios

        championship.setDriver(newDriver);
        championship.setSeason(newSeason);

        assertEquals(newDriver, championship.getDriver());
        assertEquals(newSeason, championship.getSeason());

        // @ToString
        String expectedToString = "Championship(id=1, driver=" + newDriver + ", season=" + newSeason + ")";
        assertEquals(expectedToString, championship.toString());

        // @AllArgsConstructor
        Championship allArgsConstructor = new Championship(1L, newDriver, newSeason);
        assertEquals(championship, allArgsConstructor);

        // @NoArgsConstructor
        Championship noArgsConstructor = new Championship();
        assertNotNull(noArgsConstructor);

        // @EqualsAndHashCode
        EqualsVerifier.forClass(Championship.class).suppress(Warning.ALL_FIELDS_SHOULD_BE_USED).verify();
    }

    @Test
    void testChampionshipDTOAnnotations() {
        // @NoArgsConstructor
        ChampionshipDTO noArgsConstructorDTO = new ChampionshipDTO();
        assertNotNull(noArgsConstructorDTO);

        TeamDTO team = new TeamDTO(1L, "Mercedes", null, null, null);
        DriverDTO driver = new DriverDTO(1L, "Lewis Hamilton", 0, team, null, null);
        SeasonDTO season = new SeasonDTO(2024, "Fórmula 1", 0);

        // @AllArgsConstructor
        ChampionshipDTO allArgsConstructorDTO = new ChampionshipDTO(1L, driver, season);
        assertEquals(1L, allArgsConstructorDTO.getId());
        assertEquals(driver, allArgsConstructorDTO.getDriver());
        assertEquals(season, allArgsConstructorDTO.getSeason());

        // @Getter
        assertEquals(1L, allArgsConstructorDTO.getId());
        assertEquals(driver, allArgsConstructorDTO.getDriver());
        assertEquals(season, allArgsConstructorDTO.getSeason());

        // @Setter
        TeamDTO newTeam = new TeamDTO(2L, "Red Bull Racing", null, null, season);
        DriverDTO newDriver = new DriverDTO(2L, "Max Verstappen", 0, newTeam, null, season);
        SeasonDTO newSeason = new SeasonDTO(2024, "Fórmula 1", 0);
        allArgsConstructorDTO.setDriver(newDriver);
        allArgsConstructorDTO.setSeason(newSeason);

        assertEquals(newDriver, allArgsConstructorDTO.getDriver());
        assertEquals(newSeason, allArgsConstructorDTO.getSeason());

        // @ToString
        String expectedToString = "ChampionshipDTO(id=1, driver=DriverDTO(id=2, name=Max Verstappen, number=0, team=TeamDTO(id=2, name=Red Bull Racing, carImage=null, logoImage=null, season=SeasonDTO(id=2024, name=Fórmula 1, number=0)), driverImage=null, season=SeasonDTO(id=2024, name=Fórmula 1, number=0)), season=SeasonDTO(id=2024, name=Fórmula 1, number=0))";
        assertEquals(expectedToString, allArgsConstructorDTO.toString());

        // @EqualsAndHashCode
        EqualsVerifier.simple().forClass(ChampionshipDTO.class).verify();
    }
}
