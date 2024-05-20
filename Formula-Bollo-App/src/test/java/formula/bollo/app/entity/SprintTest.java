package formula.bollo.app.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import formula.bollo.app.FormulaBolloAppApplication;
import formula.bollo.app.model.DriverDTO;
import formula.bollo.app.model.RaceDTO;
import formula.bollo.app.model.SeasonDTO;
import formula.bollo.app.model.SprintDTO;
import formula.bollo.app.model.SprintPositionDTO;
import nl.jqno.equalsverifier.EqualsVerifier;
import nl.jqno.equalsverifier.Warning;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class SprintTest {
    
    @Test
    void testSprintAnnotations() {
        Race race = new Race();
        Driver driver = new Driver();
        SprintPosition sprintPosition = new SprintPosition();
        Season season = new Season();

        Sprint sprint = new Sprint();
        sprint.setId(1L);
        sprint.setRace(race);
        sprint.setDriver(driver);
        sprint.setPosition(sprintPosition);
        sprint.setSeason(season);

        // @Getter
        assertEquals(1L, sprint.getId());
        assertEquals(race, sprint.getRace());
        assertEquals(driver, sprint.getDriver());
        assertEquals(sprintPosition, sprint.getPosition());
        assertEquals(season, sprint.getSeason());

        // @Setter
        Race newRace = new Race();
        Driver newDriver = new Driver();
        SprintPosition newPosition = new SprintPosition();
        Season newSeason = new Season();

        sprint.setRace(newRace);
        sprint.setDriver(newDriver);
        sprint.setPosition(newPosition);
        sprint.setSeason(newSeason);

        assertEquals(newRace, sprint.getRace());
        assertEquals(newDriver, sprint.getDriver());
        assertEquals(newPosition, sprint.getPosition());
        assertEquals(newSeason, sprint.getSeason());

        // @ToString
        String expectedToString = "Sprint(id=1, race=" + newRace + ", driver=" + newDriver + ", position=" + newPosition + ", season=" + newSeason + ")";
        assertEquals(expectedToString, sprint.toString());

        // @AllArgsConstructor
        Sprint allArgsConstructor = new Sprint(1L, newRace, newDriver, newPosition, newSeason);
        assertEquals(sprint, allArgsConstructor);

        // @NoArgsConstructor
        Sprint noArgsConstructor = new Sprint();
        assertNotNull(noArgsConstructor);

        // @EqualsAndHashCode
        EqualsVerifier.forClass(Sprint.class).suppress(Warning.ALL_FIELDS_SHOULD_BE_USED).verify();
    }

    @Test
    void testSprintDTOAnnotations() {
        RaceDTO race = new RaceDTO();
        DriverDTO driver = new DriverDTO();
        SprintPositionDTO sprintPosition = new SprintPositionDTO();
        SeasonDTO season = new SeasonDTO();

        SprintDTO sprintDTO = new SprintDTO();
        sprintDTO.setId(1L);
        sprintDTO.setRace(race);
        sprintDTO.setDriver(driver);
        sprintDTO.setPosition(sprintPosition);
        sprintDTO.setSeason(season);

        // @Getter
        assertEquals(1L, sprintDTO.getId());
        assertEquals(race, sprintDTO.getRace());
        assertEquals(driver, sprintDTO.getDriver());
        assertEquals(sprintPosition, sprintDTO.getPosition());
        assertEquals(season, sprintDTO.getSeason());

        // @Setter
        RaceDTO newRace = new RaceDTO();
        DriverDTO newDriver = new DriverDTO();
        SprintPositionDTO newPosition = new SprintPositionDTO();
        SeasonDTO newSeason = new SeasonDTO();

        sprintDTO.setRace(newRace);
        sprintDTO.setDriver(newDriver);
        sprintDTO.setPosition(newPosition);
        sprintDTO.setSeason(newSeason);

        assertEquals(newRace, sprintDTO.getRace());
        assertEquals(newDriver, sprintDTO.getDriver());
        assertEquals(newPosition, sprintDTO.getPosition());
        assertEquals(newSeason, sprintDTO.getSeason());

        // @AllArgsConstructor
        SprintDTO allArgsConstructor = new SprintDTO(1L, newRace, newDriver, newPosition, newSeason);
        assertEquals(sprintDTO, allArgsConstructor);

        // @NoArgsConstructor
        SprintDTO noArgsConstructor = new SprintDTO();
        assertNotNull(noArgsConstructor);

        // @EqualsAndHashCode
        EqualsVerifier.simple().forClass(SprintDTO.class).verify(); 
    }
}
