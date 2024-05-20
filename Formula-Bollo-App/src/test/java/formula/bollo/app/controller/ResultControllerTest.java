package formula.bollo.app.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.BEFORE_TEST_METHOD;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
import formula.bollo.app.model.DriverPointsDTO;
import formula.bollo.app.model.PositionDTO;
import formula.bollo.app.model.RaceDTO;
import formula.bollo.app.model.ResultDTO;
import formula.bollo.app.model.SeasonDTO;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class ResultControllerTest {

    @Autowired
    private ResultController resultController;

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/team/insertTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/driver/insertDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/position/insertPosition.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/circuit/insertCircuit.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/race/insertRace.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/result/insertResult.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getResultsPerDriver() {
        List<DriverPointsDTO> results = this.resultController.getTotalResultsPerDriver(10, 1);
        assertNotNull(results);
        assertFalse(results.isEmpty());
        assertEquals(10, results.size());

        results = this.resultController.getTotalResultsPerDriver(null, null);
        assertNotNull(results);
        assertFalse(results.isEmpty());
        assertEquals(20, results.size());
    }

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/team/insertTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/driver/insertDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/position/insertPosition.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/circuit/insertCircuit.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/race/insertRace.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getResultsPerDriverEmpty() {
        List<DriverPointsDTO> results = this.resultController.getTotalResultsPerDriver(null, 1);
        assertNotNull(results);
        assertTrue(results.isEmpty());
        assertEquals(0, results.size());
    }

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/team/insertTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/driver/insertDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/position/insertPosition.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/circuit/insertCircuit.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/race/insertRace.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/result/insertResult.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getResultsPerCircuit() {
        List<ResultDTO> results = this.resultController.getResultsPerCircuit(14, 1);
        assertNotNull(results);
        assertFalse(results.isEmpty());
        assertEquals(20, results.size());

        results = this.resultController.getResultsPerCircuit(29, null);
        assertNotNull(results);
        assertFalse(results.isEmpty());
        assertEquals(20, results.size());
    }

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/team/insertTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/driver/insertDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/position/insertPosition.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/circuit/insertCircuit.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/race/insertRace.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/result/insertResult.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getResultsPerCircuitRaceEmpty() {
        List<ResultDTO> results = this.resultController.getResultsPerCircuit(50, null);
        assertNotNull(results);
        assertTrue(results.isEmpty());
    }

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/team/insertTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/driver/insertDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/position/insertPosition.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/circuit/insertCircuit.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/race/insertRace.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/result/insertResult.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getResultsPerCircuitResultEmpty() {
        List<ResultDTO> results = this.resultController.getResultsPerCircuit(31, null);
        assertNotNull(results);
        assertTrue(results.isEmpty());
    }

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/team/insertTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/driver/insertDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/position/insertPosition.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/circuit/insertCircuit.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/race/insertRace.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/result/insertResult.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void saveResults() {
        List<ResultDTO> results = this.resultController.getResultsPerCircuit(30, 2);

        SeasonDTO season = new SeasonDTO(2L, "Temporada 2", 2);
        CircuitDTO circuit = new CircuitDTO(31L, "Imola", "Italia", null, null, season);
        RaceDTO race = new RaceDTO(31L, circuit, LocalDateTime.now(), season, 1);

        for(ResultDTO result: results) {
            result.setRace(race);
        }

        ResponseEntity<String> response = this.resultController.saveResultsCircuit(results, 2);
        assertEquals("Resultados guardados correctamente", response.getBody());
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());

        response = this.resultController.saveResultsCircuit(results, null);
        assertEquals("Resultados guardados correctamente", response.getBody());
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
    }

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/team/insertTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/driver/insertDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/position/insertPosition.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/circuit/insertCircuit.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/race/insertRace.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/result/insertResult.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void saveResultsSeasonError() {
        List<ResultDTO> results = this.resultController.getResultsPerCircuit(30, 2);

        SeasonDTO season = new SeasonDTO(3L, "Temporada 2", 3);
        CircuitDTO circuit = new CircuitDTO(31L, "Imola", "Italia", null, null, season);
        RaceDTO race = new RaceDTO(31L, circuit, LocalDateTime.now(), season, 1);

        for(ResultDTO result: results) {
            result.setRace(race);
        }

        ResponseEntity<String> response = this.resultController.saveResultsCircuit(results, 3);
        assertEquals("Hubo un problema con las temporadas", response.getBody());
        assertEquals(HttpStatusCode.valueOf(500), response.getStatusCode());
    }

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/team/insertTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/driver/insertDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/position/insertPosition.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/circuit/insertCircuit.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/race/insertRace.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/result/insertResult.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void saveResultsSeasonEmpty() {
        List<ResultDTO> results = new ArrayList<>();

        ResponseEntity<String> response = this.resultController.saveResultsCircuit(results, 2);
        assertEquals("No hay resultados", response.getBody());
        assertEquals(HttpStatusCode.valueOf(500), response.getStatusCode());
    }

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/team/insertTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/driver/insertDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/position/insertPosition.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/circuit/insertCircuit.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/race/insertRace.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/result/insertResult.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void saveResultsGenericError() {
        List<ResultDTO> results = this.resultController.getResultsPerCircuit(14, 1);
        assertNotNull(results);
        assertFalse(results.isEmpty());
        assertEquals(20, results.size());

        results.get(3).setPosition(new PositionDTO(6, 6, 3));
        results.get(9).setPosition(new PositionDTO(5, 5, 4));
        ResponseEntity<String> response = this.resultController.saveResultsCircuit(results, null);
        assertEquals("Hubo un error. Contacta con el administrador", response.getBody());
        assertEquals(HttpStatusCode.valueOf(500), response.getStatusCode());
    }
}
