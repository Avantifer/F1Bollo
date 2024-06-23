package formula.bollo.app.entity;

import nl.jqno.equalsverifier.EqualsVerifier;
import nl.jqno.equalsverifier.Warning;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import formula.bollo.app.FormulaBolloAppApplication;
import formula.bollo.app.model.DriverDTO;
import formula.bollo.app.model.PositionDTO;
import formula.bollo.app.model.RaceDTO;
import formula.bollo.app.model.ResultDTO;
import formula.bollo.app.model.SeasonDTO;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class ResultTest {

    @Test
    void testResultAnnotations() {
        Race race = new Race();
        Driver driver = new Driver();
        Position position = new Position();
        Season season = new Season();

        Result result = new Result();
        result.setId(1L);
        result.setRace(race);
        result.setDriver(driver);
        result.setPosition(position);
        result.setFastlap(1);
        result.setPole(1);
        result.setSeason(season);

        // @Getter
        assertEquals(1L, result.getId());
        assertEquals(race, result.getRace());
        assertEquals(driver, result.getDriver());
        assertEquals(position, result.getPosition());
        assertEquals(1, result.getFastlap());
        assertEquals(1, result.getPole());
        assertEquals(season, result.getSeason());

        // @Setter
        Race newRace = new Race();
        Driver newDriver = new Driver();
        Position newPosition = new Position();
        Season newSeason = new Season();

        result.setRace(newRace);
        result.setDriver(newDriver);
        result.setPosition(newPosition);
        result.setFastlap(0);
        result.setPole(0);
        result.setSeason(newSeason);

        assertEquals(newRace, result.getRace());
        assertEquals(newDriver, result.getDriver());
        assertEquals(newPosition, result.getPosition());
        assertEquals(0, result.getFastlap());
        assertEquals(0, result.getPole());
        assertEquals(newSeason, result.getSeason());

        // @ToString
        String expectedToString = "Result(id=1, race=" + newRace + ", driver=" + newDriver + ", position=" + newPosition + ", fastlap=0, pole=0, season=" + newSeason + ")";
        assertEquals(expectedToString, result.toString());

        // @AllArgsConstructor
        Result allArgsConstructor = new Result(1L, newRace, newDriver, newPosition, 0, 0, newSeason);
        assertEquals(result, allArgsConstructor);

        // @NoArgsConstructor
        Result noArgsConstructor = new Result();
        assertNotNull(noArgsConstructor);

        // @EqualsAndHashCode
        EqualsVerifier.forClass(Result.class).suppress(Warning.ALL_FIELDS_SHOULD_BE_USED).verify();
    }

    @Test
    void testResultDTOAnnotations() {
        RaceDTO race = new RaceDTO();
        DriverDTO driver = new DriverDTO();
        PositionDTO position = new PositionDTO();
        SeasonDTO season = new SeasonDTO();

        ResultDTO resultDTO = new ResultDTO();
        resultDTO.setId(1L);
        resultDTO.setRace(race);
        resultDTO.setDriver(driver);
        resultDTO.setPosition(position);
        resultDTO.setFastlap(1);
        resultDTO.setPole(1);
        resultDTO.setSeason(season);

        // @Getter
        assertEquals(1L, resultDTO.getId());
        assertEquals(race, resultDTO.getRace());
        assertEquals(driver, resultDTO.getDriver());
        assertEquals(position, resultDTO.getPosition());
        assertEquals(1, resultDTO.getFastlap());
        assertEquals(1, resultDTO.getPole());
        assertEquals(season, resultDTO.getSeason());

        // @Setter
        RaceDTO newRace = new RaceDTO();
        DriverDTO newDriver = new DriverDTO();
        PositionDTO newPosition = new PositionDTO();
        SeasonDTO newSeason = new SeasonDTO();

        resultDTO.setRace(newRace);
        resultDTO.setDriver(newDriver);
        resultDTO.setPosition(newPosition);
        resultDTO.setFastlap(0);
        resultDTO.setPole(0);
        resultDTO.setSeason(newSeason);

        assertEquals(newRace, resultDTO.getRace());
        assertEquals(newDriver, resultDTO.getDriver());
        assertEquals(newPosition, resultDTO.getPosition());
        assertEquals(0, resultDTO.getFastlap());
        assertEquals(0, resultDTO.getPole());
        assertEquals(newSeason, resultDTO.getSeason());

        // @AllArgsConstructor
        ResultDTO allArgsConstructor = new ResultDTO(1L, newRace, newDriver, newPosition, 0, newSeason, 0);
        assertEquals(resultDTO, allArgsConstructor);

        // @NoArgsConstructor
        ResultDTO noArgsConstructor = new ResultDTO();
        assertNotNull(noArgsConstructor);

        // @EqualsAndHashCode
        EqualsVerifier.simple().forClass(ResultDTO.class).verify();  
    }
}