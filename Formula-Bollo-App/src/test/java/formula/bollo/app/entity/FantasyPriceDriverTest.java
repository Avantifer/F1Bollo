package formula.bollo.app.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import formula.bollo.app.FormulaBolloAppApplication;
import formula.bollo.app.model.DriverDTO;
import formula.bollo.app.model.FantasyPriceDriverDTO;
import formula.bollo.app.model.RaceDTO;
import formula.bollo.app.model.SeasonDTO;
import nl.jqno.equalsverifier.EqualsVerifier;
import nl.jqno.equalsverifier.Warning;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class FantasyPriceDriverTest {
    
    @Test
    void testFantasyPriceDriverAnnotations() {
        Driver driver = new Driver();
        Race race = new Race();
        Season season = new Season();

        FantasyPriceDriver fantasyPriceDriver = new FantasyPriceDriver();
        fantasyPriceDriver.setId(1L);
        fantasyPriceDriver.setDriver(driver);
        fantasyPriceDriver.setRace(race);
        fantasyPriceDriver.setPrice(100);
        fantasyPriceDriver.setSeason(season);

        // @Getter
        assertEquals(1L, fantasyPriceDriver.getId());
        assertEquals(driver, fantasyPriceDriver.getDriver());
        assertEquals(race, fantasyPriceDriver.getRace());
        assertEquals(100, fantasyPriceDriver.getPrice());
        assertEquals(season, fantasyPriceDriver.getSeason());

        // @Setter
        Driver newDriver = new Driver();
        Race newRace = new Race();
        Season newSeason = new Season();

        fantasyPriceDriver.setDriver(newDriver);
        fantasyPriceDriver.setRace(newRace);
        fantasyPriceDriver.setPrice(200);
        fantasyPriceDriver.setSeason(newSeason);

        assertEquals(newDriver, fantasyPriceDriver.getDriver());
        assertEquals(newRace, fantasyPriceDriver.getRace());
        assertEquals(200, fantasyPriceDriver.getPrice());
        assertEquals(newSeason, fantasyPriceDriver.getSeason());

        // @ToString
        String expectedToString = "FantasyPriceDriver(id=1, driver=" + newDriver + ", race=" + newRace + ", price=200, season=" + newSeason + ")";
        assertEquals(expectedToString, fantasyPriceDriver.toString());

        // @AllArgsConstructor
        FantasyPriceDriver allArgsConstructor = new FantasyPriceDriver(1L, newDriver, newRace, 200, newSeason);
        assertEquals(fantasyPriceDriver, allArgsConstructor);

        // @NoArgsConstructor
        FantasyPriceDriver noArgsConstructor = new FantasyPriceDriver();
        assertNotNull(noArgsConstructor);

        // @EqualsAndHashCode
        EqualsVerifier.forClass(FantasyPriceDriver.class).suppress(Warning.ALL_FIELDS_SHOULD_BE_USED).verify();
    }

    @Test
    void testFantasyPriceDriverDTOAnnotations() {
        DriverDTO driverDTO = new DriverDTO();
        RaceDTO raceDTO = new RaceDTO();
        SeasonDTO seasonDTO = new SeasonDTO();

        FantasyPriceDriverDTO fantasyPriceDriverDTO = new FantasyPriceDriverDTO();
        fantasyPriceDriverDTO.setId(1L);
        fantasyPriceDriverDTO.setDriver(driverDTO);
        fantasyPriceDriverDTO.setRace(raceDTO);
        fantasyPriceDriverDTO.setPrice(100);
        fantasyPriceDriverDTO.setSeason(seasonDTO);

        // @Getter
        assertEquals(1L, fantasyPriceDriverDTO.getId());
        assertEquals(driverDTO, fantasyPriceDriverDTO.getDriver());
        assertEquals(raceDTO, fantasyPriceDriverDTO.getRace());
        assertEquals(seasonDTO, fantasyPriceDriverDTO.getSeason());

        // @Setter
        DriverDTO newDriverDTO = new DriverDTO();
        RaceDTO newRaceDTO = new RaceDTO();
        SeasonDTO newSeasonDTO = new SeasonDTO();

        fantasyPriceDriverDTO.setDriver(newDriverDTO);
        fantasyPriceDriverDTO.setRace(newRaceDTO);
        fantasyPriceDriverDTO.setPrice(200);
        fantasyPriceDriverDTO.setSeason(newSeasonDTO);

        assertEquals(newDriverDTO, fantasyPriceDriverDTO.getDriver());
        assertEquals(newRaceDTO, fantasyPriceDriverDTO.getRace());
        assertEquals(200, fantasyPriceDriverDTO.getPrice());
        assertEquals(newSeasonDTO, fantasyPriceDriverDTO.getSeason());

        // @ToString
        String expectedToString = "FantasyPriceDriverDTO(id=1, driver=" + newDriverDTO + ", race=" + newRaceDTO + ", price=200, season=" + newSeasonDTO + ")";
        assertEquals(expectedToString, fantasyPriceDriverDTO.toString());

        // @AllArgsConstructor
        FantasyPriceDriverDTO allArgsConstructor = new FantasyPriceDriverDTO(1L, newDriverDTO, newRaceDTO, 200, newSeasonDTO);
        assertEquals(fantasyPriceDriverDTO, allArgsConstructor);

        // @NoArgsConstructor
        FantasyPriceDriverDTO noArgsConstructor = new FantasyPriceDriverDTO();
        assertNotNull(noArgsConstructor);

        // @EqualsAndHashCode
        EqualsVerifier.simple().forClass(FantasyPriceDriverDTO.class).verify();
    }
}
