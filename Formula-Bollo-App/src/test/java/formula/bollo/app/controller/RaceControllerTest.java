package formula.bollo.app.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.BEFORE_TEST_METHOD;

import java.time.LocalDateTime;
import java.util.GregorianCalendar;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.SqlGroup;


import formula.bollo.app.FormulaBolloAppApplication;
import formula.bollo.app.model.CircuitDTO;
import formula.bollo.app.model.RaceDTO;
import formula.bollo.app.model.SeasonDTO;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class RaceControllerTest {
    
    @Autowired
    private RaceController raceController;

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/circuit/insertCircuit.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/race/insertRace.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getRacesPerCircuit() {
        List<RaceDTO> races = this.raceController.getRacesPerCircuit(14, 1);
        assertNotNull(races);
        assertFalse(races.isEmpty());
        assertEquals("Spa-Francorchamps", races.get(0).getCircuit().getName());
        assertEquals(1, races.get(0).getSeason().getNumber());

        races = this.raceController.getRacesPerCircuit(14, null);
        assertNotNull(races);
        assertTrue(races.isEmpty());
    }

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/circuit/insertCircuit.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/race/insertRace.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void saveCircuit() {
        SeasonDTO season = new SeasonDTO(2, "Temporada 2", 2);
        LocalDateTime date = new GregorianCalendar().toZonedDateTime().toLocalDateTime();
        CircuitDTO circuit = new CircuitDTO(
            14L,
            "Circuito de Granada", 
            "Granada",
            "AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAClgAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAfQAAAEsAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQEMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAACmBtZGF0EgAKChhiPnK2SBAQNCAyxxRMXALVsf5NZn6Fh1n6uAVvo1hE",
            "AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAClgAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAfQAAAEsAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQEMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAACmBtZGF0EgAKChhiPnK2SBAQNCAyxxRMXALVsf5NZn6Fh1n6uAVvo1hE",
            season
        );
        RaceDTO race = new RaceDTO(150L, circuit, date, season, 0);

        ResponseEntity<String> response = this.raceController.saveCircuit(race, 2);

        assertEquals("Carrera guardada correctamente", response.getBody());
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());

        response = this.raceController.saveCircuit(race, null);

        assertEquals("Carrera guardada correctamente", response.getBody());
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
    }

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/circuit/insertCircuit.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/race/insertRace.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void saveCircuitErrorSeason() {
        SeasonDTO season = new SeasonDTO(2, "Temporada 2", 2);
        LocalDateTime date = new GregorianCalendar().toZonedDateTime().toLocalDateTime();
        CircuitDTO circuit = new CircuitDTO(14L, "Circuito de Granada", "Granada", "0x000", "0x000", season);
        RaceDTO race = new RaceDTO(150L, circuit, date, season, 0);

        ResponseEntity<String> response = this.raceController.saveCircuit(race, 3);

        assertEquals("Hubo un problema con las temporadas", response.getBody());
        assertEquals(HttpStatusCode.valueOf(500), response.getStatusCode());
    }

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/circuit/insertCircuit.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/race/insertRace.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void saveCircuitErrorGeneric() {
        SeasonDTO season = new SeasonDTO(2, "Temporada 2", 2);
        LocalDateTime date = new GregorianCalendar().toZonedDateTime().toLocalDateTime();
        CircuitDTO circuit = new CircuitDTO(150L, "Circuito de Granada", "Granada", "0x000", "0x000", season);
        RaceDTO race = new RaceDTO(150L, circuit, date, season, 0);

        ResponseEntity<String> response = this.raceController.saveCircuit(race, null);

        assertEquals("Hubo un error. Contacta con el administrador", response.getBody());
        assertEquals(HttpStatusCode.valueOf(500), response.getStatusCode());
    }

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/circuit/insertCircuit.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/race/insertRace.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getAllPreviousRacesAndNextOne() {
        List<RaceDTO> races = this.raceController.getAllPreviousAndNextOne(2);
        assertNotNull(races);
        assertFalse(races.isEmpty());

        races = this.raceController.getAllPreviousAndNextOne(null);
        assertNotNull(races);
        assertFalse(races.isEmpty());
    }

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/circuit/insertCircuit.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/race/insertRace.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getAllPreviousRaces() {
        List<RaceDTO> races = this.raceController.getAllPrevious(2);
        assertNotNull(races);
        assertFalse(races.isEmpty());

        races = this.raceController.getAllPrevious(null);
        assertNotNull(races);
        assertFalse(races.isEmpty());
    }
}
