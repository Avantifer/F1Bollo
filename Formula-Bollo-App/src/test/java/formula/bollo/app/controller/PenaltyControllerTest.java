package formula.bollo.app.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.BEFORE_TEST_METHOD;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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
import formula.bollo.app.model.DriverPenaltiesDTO;
import formula.bollo.app.model.PenaltyDTO;
import formula.bollo.app.model.RaceDTO;
import formula.bollo.app.model.SeasonDTO;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class PenaltyControllerTest {
    
    @Autowired
    private PenaltyController penaltyController;

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
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penalty/insertPenalty.sql", executionPhase = BEFORE_TEST_METHOD)
    })
    void getAllPenalties() {
        List<PenaltyDTO> penalties = this.penaltyController.getAllPenalties(1);
        assertNotNull(penalties);
        assertFalse(penalties.isEmpty());
        assertEquals(27, penalties.size());

        penalties = this.penaltyController.getAllPenalties(null);
        assertNotNull(penalties);
        assertFalse(penalties.isEmpty());
        assertEquals(13, penalties.size());
    }

    @Test
    @DirtiesContext
    void getAllPenaltiesEmpty() {
        List<PenaltyDTO> penalties = this.penaltyController.getAllPenalties(1);
        assertNotNull(penalties);
        assertTrue(penalties.isEmpty());
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
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penalty/insertPenalty.sql", executionPhase = BEFORE_TEST_METHOD)
    })
    void getAllPenaltiesByCircuit() {
        List<PenaltyDTO> penalties = this.penaltyController.getPenaltiesByCircuit(15, 1);
        assertNotNull(penalties);
        assertFalse(penalties.isEmpty());
        assertEquals(6, penalties.size());

        penalties = this.penaltyController.getPenaltiesByCircuit(29, null);
        assertNotNull(penalties);
        assertFalse(penalties.isEmpty());
        assertEquals(2, penalties.size());
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
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penalty/insertPenalty.sql", executionPhase = BEFORE_TEST_METHOD)
    })
    void getAllPenaltiesByCircuitEmpty() {
        List<PenaltyDTO> penalties = this.penaltyController.getPenaltiesByCircuit(30, 1);
        assertNotNull(penalties);
        assertTrue(penalties.isEmpty());

        penalties = this.penaltyController.getPenaltiesByCircuit(1, 1);
        assertNotNull(penalties);
        assertTrue(penalties.isEmpty());
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
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penalty/insertPenalty.sql", executionPhase = BEFORE_TEST_METHOD)
    })
    void getAllPenaltiesByDriverAndRace() {
        List<DriverPenaltiesDTO> penalties = this.penaltyController.getPenaltiesByDriverAndRace(1);
        assertNotNull(penalties);
        assertFalse(penalties.isEmpty());

        Optional<DriverPenaltiesDTO> driverPenalty = penalties.stream().filter((DriverPenaltiesDTO driver) -> driver.getDriver().getId() == 1).findFirst();
        assertNotNull(driverPenalty);
        assertTrue(driverPenalty.isPresent());
        assertEquals(1, driverPenalty.get().getRacePenalties().size());

        penalties = this.penaltyController.getPenaltiesByDriverAndRace(null);
        assertNotNull(penalties);
        assertFalse(penalties.isEmpty());

        driverPenalty = penalties.stream().filter((DriverPenaltiesDTO driver) -> driver.getDriver().getId() == 31).findAny();
        assertNotNull(driverPenalty);
        assertTrue(driverPenalty.isPresent());
        assertEquals(3, driverPenalty.get().getRacePenalties().size());
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
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penalty/insertPenalty.sql", executionPhase = BEFORE_TEST_METHOD)
    })
    void getAllPenaltiesByDriverAndRaceEmpty() {
        List<DriverPenaltiesDTO> penalties = this.penaltyController.getPenaltiesByDriverAndRace(3);
        assertNotNull(penalties);
        assertTrue(penalties.isEmpty());
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
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penalty/insertPenalty.sql", executionPhase = BEFORE_TEST_METHOD)
    })
    void savePenalties() {
        List<PenaltyDTO> penalties = this.penaltyController.getAllPenalties(1);

        SeasonDTO season = new SeasonDTO(2L, "Temporada 2", 2);
        CircuitDTO circuit = new CircuitDTO(
            31L,
            "Imola",
            "Italia",
            "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",
            season
        );
        RaceDTO race = new RaceDTO(31L, circuit, LocalDateTime.now(), season, 1);

        for(PenaltyDTO penalty: penalties) {
            penalty.setRace(race);
            penalty.setSeason(season);
        }

        ResponseEntity<String> response = this.penaltyController.savePenalty(penalties, null);
        assertEquals("Penalización guardada correctamente", response.getBody());
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());

        response = this.penaltyController.savePenalty(penalties, 2);
        assertEquals("Penalización guardada correctamente", response.getBody());
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
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penalty/insertPenalty.sql", executionPhase = BEFORE_TEST_METHOD)
    })
    void savePenaltiesSeasonError() {
        List<PenaltyDTO> penalties = this.penaltyController.getAllPenalties(1);

        SeasonDTO season = new SeasonDTO(3L, "Temporada 3", 3);
        CircuitDTO circuit = new CircuitDTO(31L, "Imola", "Italia", null, null, season);
        RaceDTO race = new RaceDTO(31L, circuit, LocalDateTime.now(), season, 1);

        for(PenaltyDTO penalty: penalties) {
            penalty.setRace(race);
            penalty.setSeason(season);
        }

        ResponseEntity<String> response = this.penaltyController.savePenalty(penalties, 3);
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
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penalty/insertPenalty.sql", executionPhase = BEFORE_TEST_METHOD)
    })
    void savePenaltiesGenericError() {
        List<PenaltyDTO> penalties = this.penaltyController.getPenaltiesByCircuit(55, 1);

        ResponseEntity<String> response = this.penaltyController.savePenalty(penalties, null);
        assertEquals("Hubo un error. Contacta con el administrador", response.getBody());
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
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penalty/insertPenalty.sql", executionPhase = BEFORE_TEST_METHOD)
    })
    void getPenaltyByDriverAndRace() {
        List<PenaltyDTO> penalties = this.penaltyController.getPenaltyByDriverAndRace(19, 15, 2, 1);
        assertNotNull(penalties);
        assertFalse(penalties.isEmpty());
        assertEquals(1, penalties.size());

        penalties = this.penaltyController.getPenaltyByDriverAndRace(31, 27, 2, null);
        assertNotNull(penalties);
        assertFalse(penalties.isEmpty());
        assertEquals(2, penalties.size());
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
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penalty/insertPenalty.sql", executionPhase = BEFORE_TEST_METHOD)
    })
    void getPenaltyByDriverAndRaceEmpty() {
        List<PenaltyDTO> penalties = this.penaltyController.getPenaltyByDriverAndRace(19, 15, 3, 1);
        assertNotNull(penalties);
        assertTrue(penalties.isEmpty());
    }
}
