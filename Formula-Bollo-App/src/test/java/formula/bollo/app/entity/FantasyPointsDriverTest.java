package formula.bollo.app.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import formula.bollo.app.FormulaBolloAppApplication;
import formula.bollo.app.model.DriverDTO;
import formula.bollo.app.model.FantasyPointsDriverDTO;
import formula.bollo.app.model.RaceDTO;
import formula.bollo.app.model.SeasonDTO;
import nl.jqno.equalsverifier.EqualsVerifier;
import nl.jqno.equalsverifier.Warning;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class FantasyPointsDriverTest {
    
    @Test
    void testFantasyPointsDriverAnnotations() {
        Driver driver = new Driver();
        Race race = new Race();
        Season season = new Season();

        FantasyPointsDriver fantasyPointsDriver = new FantasyPointsDriver();
        fantasyPointsDriver.setId(1L);
        fantasyPointsDriver.setDriver(driver);
        fantasyPointsDriver.setRace(race);
        fantasyPointsDriver.setPoints(100);
        fantasyPointsDriver.setSeason(season);

        // @Getter
        assertEquals(1L, fantasyPointsDriver.getId());
        assertEquals(driver, fantasyPointsDriver.getDriver());
        assertEquals(race, fantasyPointsDriver.getRace());
        assertEquals(100, fantasyPointsDriver.getPoints());
        assertEquals(season, fantasyPointsDriver.getSeason());

        // @Setter
        Driver newDriver = new Driver();
        Race newRace = new Race();
        Season newSeason = new Season();

        fantasyPointsDriver.setDriver(newDriver);
        fantasyPointsDriver.setRace(newRace);
        fantasyPointsDriver.setPoints(200);
        fantasyPointsDriver.setSeason(newSeason);

        assertEquals(newDriver, fantasyPointsDriver.getDriver());
        assertEquals(newRace, fantasyPointsDriver.getRace());
        assertEquals(200, fantasyPointsDriver.getPoints());
        assertEquals(newSeason, fantasyPointsDriver.getSeason());

        // @ToString
        String expectedToString = "FantasyPointsDriver(id=1, driver=" + newDriver + ", race=" + newRace + ", points=200, season=" + newSeason + ")";
        assertEquals(expectedToString, fantasyPointsDriver.toString());

        // @AllArgsConstructor
        FantasyPointsDriver allArgsConstructor = new FantasyPointsDriver(1L, newDriver, newRace, 200, newSeason);
        assertEquals(fantasyPointsDriver, allArgsConstructor);

        // @NoArgsConstructor
        FantasyPointsDriver noArgsConstructor = new FantasyPointsDriver();
        assertNotNull(noArgsConstructor);

        // @EqualsAndHashCode
        EqualsVerifier.forClass(FantasyPointsDriver.class).suppress(Warning.ALL_FIELDS_SHOULD_BE_USED).verify();
    }

    @Test
    void testFantasyPointsDriverDTOAnnotations() {
        DriverDTO driverDTO = new DriverDTO();
        RaceDTO raceDTO = new RaceDTO();
        SeasonDTO seasonDTO = new SeasonDTO();

        FantasyPointsDriverDTO fantasyPointsDriverDTO = new FantasyPointsDriverDTO();
        fantasyPointsDriverDTO.setId(1L);
        fantasyPointsDriverDTO.setDriver(driverDTO);
        fantasyPointsDriverDTO.setRace(raceDTO);
        fantasyPointsDriverDTO.setPoints(100);
        fantasyPointsDriverDTO.setSeason(seasonDTO);

        // @Getter
        assertEquals(1L, fantasyPointsDriverDTO.getId());
        assertEquals(driverDTO, fantasyPointsDriverDTO.getDriver());
        assertEquals(raceDTO, fantasyPointsDriverDTO.getRace());
        assertEquals(100, fantasyPointsDriverDTO.getPoints());
        assertEquals(seasonDTO, fantasyPointsDriverDTO.getSeason());

        // @Setter
        DriverDTO newDriverDTO = new DriverDTO();
        RaceDTO newRaceDTO = new RaceDTO();
        SeasonDTO newSeasonDTO = new SeasonDTO();

        fantasyPointsDriverDTO.setDriver(newDriverDTO);
        fantasyPointsDriverDTO.setRace(newRaceDTO);
        fantasyPointsDriverDTO.setPoints(200);
        fantasyPointsDriverDTO.setSeason(newSeasonDTO);

        assertEquals(newDriverDTO, fantasyPointsDriverDTO.getDriver());
        assertEquals(newRaceDTO, fantasyPointsDriverDTO.getRace());
        assertEquals(200, fantasyPointsDriverDTO.getPoints());
        assertEquals(newSeasonDTO, fantasyPointsDriverDTO.getSeason());

        // @ToString
        String expectedToString = "FantasyPointsDriverDTO(id=1, driver=" + newDriverDTO + ", race=" + newRaceDTO + ", points=200, season=" + newSeasonDTO + ")";
        assertEquals(expectedToString, fantasyPointsDriverDTO.toString());

        // @EqualsAndHashCode
        EqualsVerifier.simple().forClass(FantasyPointsDriverDTO.class).verify();
    }
}
