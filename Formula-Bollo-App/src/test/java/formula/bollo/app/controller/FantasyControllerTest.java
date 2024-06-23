package formula.bollo.app.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

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
import formula.bollo.app.model.FantasyElectionDTO;
import formula.bollo.app.model.FantasyInfoDTO;
import formula.bollo.app.model.FantasyPointsDriverDTO;
import formula.bollo.app.model.FantasyPointsTeamDTO;
import formula.bollo.app.model.FantasyPointsUserDTO;
import formula.bollo.app.model.FantasyPriceDriverDTO;
import formula.bollo.app.model.FantasyPriceTeamDTO;
import formula.bollo.app.model.RaceDTO;
import formula.bollo.app.model.SeasonDTO;

import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.BEFORE_TEST_METHOD;

import java.time.LocalDateTime;
import java.util.GregorianCalendar;
import java.util.List;


@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class FantasyControllerTest {
    
    @Autowired
    private FantasyController fantasyController;

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
        @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyElection/insertFantasyElection.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsDriver/insertFantasyPointsDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsTeam/insertFantasyPointsTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceDriver/insertFantasyPriceDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceTeam/insertFantasyPriceTeam.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void saveDriverTeamPoints() {
        ResponseEntity<String> response = this.fantasyController.saveDriverTeamPoints(30);
        assertEquals("Puntos guardados correctamente", response.getBody());
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
        @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyElection/insertFantasyElection.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsDriver/insertFantasyPointsDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsTeam/insertFantasyPointsTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceDriver/insertFantasyPriceDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceTeam/insertFantasyPriceTeam.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void saveDriverTeamPointEmpty() {
        ResponseEntity<String> response = this.fantasyController.saveDriverTeamPoints(22);
        assertEquals("Hubo un problema con los puntos. Contacte con el administrador", response.getBody());
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
        @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyElection/insertFantasyElection.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsDriver/insertFantasyPointsDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsTeam/insertFantasyPointsTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceDriver/insertFantasyPriceDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceTeam/insertFantasyPriceTeam.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getAllDriverPoints() {
        List<FantasyPointsDriverDTO> fantasyPointsDriver = this.fantasyController.getAllDriverPoints(30);
        assertNotNull(fantasyPointsDriver);
        assertFalse(fantasyPointsDriver.isEmpty());
        assertEquals(20, fantasyPointsDriver.size());
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
        @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyElection/insertFantasyElection.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsDriver/insertFantasyPointsDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsTeam/insertFantasyPointsTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceDriver/insertFantasyPriceDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceTeam/insertFantasyPriceTeam.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getDriverPointsSpecificRace() {
        FantasyPointsDriverDTO fantasyPointsDriver = this.fantasyController.getDriverPointsSpecificRace(22, 30);
        assertNotNull(fantasyPointsDriver);
        assertEquals(0, fantasyPointsDriver.getPoints());
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
        @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyElection/insertFantasyElection.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsDriver/insertFantasyPointsDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsTeam/insertFantasyPointsTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceDriver/insertFantasyPriceDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceTeam/insertFantasyPriceTeam.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getDriverPointsSpecificRaceEmpty() {
        FantasyPointsDriverDTO fantasyPointsDriver = this.fantasyController.getDriverPointsSpecificRace(22, 32);
        assertNull(fantasyPointsDriver);
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
        @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyElection/insertFantasyElection.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsDriver/insertFantasyPointsDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsTeam/insertFantasyPointsTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceDriver/insertFantasyPriceDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceTeam/insertFantasyPriceTeam.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getAllTeamPoints() {
        List<FantasyPointsTeamDTO> fantasyPointsTeam = this.fantasyController.getAllTeamPoints(30);
        assertNotNull(fantasyPointsTeam);
        assertFalse(fantasyPointsTeam.isEmpty());
        assertEquals(10, fantasyPointsTeam.size());
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
        @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyElection/insertFantasyElection.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsDriver/insertFantasyPointsDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsTeam/insertFantasyPointsTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceDriver/insertFantasyPriceDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceTeam/insertFantasyPriceTeam.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getTeamPointsSpecificRace() {
        FantasyPointsTeamDTO fantasyPointTeam = this.fantasyController.teamsPointsSpecificRace(11, 30);
        assertNotNull(fantasyPointTeam);
        assertEquals(5, fantasyPointTeam.getPoints());
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
        @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyElection/insertFantasyElection.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsDriver/insertFantasyPointsDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsTeam/insertFantasyPointsTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceDriver/insertFantasyPriceDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceTeam/insertFantasyPriceTeam.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getTeamPointsSpecificRaceEmpty() {
        FantasyPointsTeamDTO fantasyPointTeam = this.fantasyController.teamsPointsSpecificRace(11, 32);
        assertNull(fantasyPointTeam);
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
        @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyElection/insertFantasyElection.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsDriver/insertFantasyPointsDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsTeam/insertFantasyPointsTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceDriver/insertFantasyPriceDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceTeam/insertFantasyPriceTeam.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void saveDriverTeamPrices() {
        ResponseEntity<String> response = this.fantasyController.saveDriverTeamPrices(30);
        assertEquals("Precios guardados correctamente", response.getBody());
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
        @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyElection/insertFantasyElection.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsDriver/insertFantasyPointsDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsTeam/insertFantasyPointsTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceDriver/insertFantasyPriceDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceTeam/insertFantasyPriceTeam.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void saveDriverTeamPriceEmpty() {
        ResponseEntity<String> response = this.fantasyController.saveDriverTeamPrices(22);
        assertEquals("Hubo un problema con los precios. Contacte con el administrador", response.getBody());
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
        @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyElection/insertFantasyElection.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsDriver/insertFantasyPointsDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsTeam/insertFantasyPointsTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceDriver/insertFantasyPriceDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceTeam/insertFantasyPriceTeam.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void saveDriverTeamPriceNextRaceNotFound() {
        ResponseEntity<String> response = this.fantasyController.saveDriverTeamPrices(48);
        assertEquals("No se ha encontrado la siguiente carrera", response.getBody());
        assertEquals(HttpStatusCode.valueOf(404), response.getStatusCode());
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
        @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyElection/insertFantasyElection.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsDriver/insertFantasyPointsDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsTeam/insertFantasyPointsTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceDriver/insertFantasyPriceDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceTeam/insertFantasyPriceTeam.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getAllDriverPrices() {
        List<FantasyPriceDriverDTO> fantasyPriceDrivers = this.fantasyController.getAllDriverPrices(30);
        assertNotNull(fantasyPriceDrivers);
        assertFalse(fantasyPriceDrivers.isEmpty());
        assertEquals(20, fantasyPriceDrivers.size());
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
        @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyElection/insertFantasyElection.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsDriver/insertFantasyPointsDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsTeam/insertFantasyPointsTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceDriver/insertFantasyPriceDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceTeam/insertFantasyPriceTeam.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getAllTeamPrices() {
        List<FantasyPriceTeamDTO> fantasyPriceTeams = this.fantasyController.getAllTeamPrices(30);
        assertNotNull(fantasyPriceTeams);
        assertFalse(fantasyPriceTeams.isEmpty());
        assertEquals(10, fantasyPriceTeams.size());
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
        @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyElection/insertFantasyElection.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsDriver/insertFantasyPointsDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsTeam/insertFantasyPointsTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceDriver/insertFantasyPriceDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceTeam/insertFantasyPriceTeam.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getInfoByDriver() {
        FantasyInfoDTO fantasyInfo = this.fantasyController.getInfoByDriver(22);
        assertNotNull(fantasyInfo);
        assertEquals(37, fantasyInfo.getTotalPoints());
        assertEquals(-10, (int) fantasyInfo.getDifferencePrice());
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
        @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyElection/insertFantasyElection.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsDriver/insertFantasyPointsDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsTeam/insertFantasyPointsTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceDriver/insertFantasyPriceDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceTeam/insertFantasyPriceTeam.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getInfoByDriverEmpty() {
        FantasyInfoDTO fantasyInfo = this.fantasyController.getInfoByDriver(50);
        assertNotNull(fantasyInfo);
        assertEquals(0, fantasyInfo.getTotalPoints());
        assertEquals(0, fantasyInfo.getDifferencePrice());
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
        @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyElection/insertFantasyElection.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsDriver/insertFantasyPointsDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsTeam/insertFantasyPointsTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceDriver/insertFantasyPriceDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceTeam/insertFantasyPriceTeam.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getInfoByTeam() {
        FantasyInfoDTO fantasyInfo = this.fantasyController.getInfoByTeam(11);
        assertNotNull(fantasyInfo);
        assertEquals(18, fantasyInfo.getTotalPoints());
        assertEquals(10, (int) fantasyInfo.getDifferencePrice());
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
        @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyElection/insertFantasyElection.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsDriver/insertFantasyPointsDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsTeam/insertFantasyPointsTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceDriver/insertFantasyPriceDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceTeam/insertFantasyPriceTeam.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getInfoByTeamEmpty() {
        FantasyInfoDTO fantasyInfo = this.fantasyController.getInfoByTeam(30);
        assertNotNull(fantasyInfo);
        assertEquals(0, fantasyInfo.getTotalPoints());
        assertEquals(0, fantasyInfo.getDifferencePrice());
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
        @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyElection/insertFantasyElection.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsDriver/insertFantasyPointsDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsTeam/insertFantasyPointsTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceDriver/insertFantasyPriceDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceTeam/insertFantasyPriceTeam.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void saveFantasyElection() {
        FantasyElectionDTO fantasyElection = this.fantasyController.getFantasyElection(25, 1);
        ResponseEntity<String> response = this.fantasyController.saveFantasyElection(fantasyElection);
        assertEquals("Tu equipo ha sido guardado correctamente", response.getBody());
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());

        fantasyElection = this.fantasyController.getFantasyElection(25, 1);
        SeasonDTO season = new SeasonDTO(2, "Temporada 2", 2);
        LocalDateTime date = new GregorianCalendar().toZonedDateTime().toLocalDateTime();
        CircuitDTO circuit = new CircuitDTO(30L, "Circuito de Granada", "Granada", null, null, season);
        RaceDTO race = new RaceDTO(32L, circuit, date, season, 0);

        fantasyElection.setRace(race);
        response = this.fantasyController.saveFantasyElection(fantasyElection);
        assertEquals("Tu equipo ha sido guardado correctamente", response.getBody());
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
        @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyElection/insertFantasyElection.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsDriver/insertFantasyPointsDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsTeam/insertFantasyPointsTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceDriver/insertFantasyPriceDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceTeam/insertFantasyPriceTeam.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getFantasyElection() {
        FantasyElectionDTO fantasyElection = this.fantasyController.getFantasyElection(25, 1);
        assertNotNull(fantasyElection);
        assertEquals("Juannudi", fantasyElection.getDriverOne().getName());
        assertEquals("Dani Calde", fantasyElection.getDriverTwo().getName());
        assertEquals("Moraga", fantasyElection.getDriverThree().getName());
        assertEquals("Red Bull", fantasyElection.getTeamOne().getName());
        assertEquals("Alpine", fantasyElection.getTeamTwo().getName());
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
        @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyElection/insertFantasyElection.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsDriver/insertFantasyPointsDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsTeam/insertFantasyPointsTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceDriver/insertFantasyPriceDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceTeam/insertFantasyPriceTeam.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getFantasyElectionEmpty() {
        FantasyElectionDTO fantasyElection = this.fantasyController.getFantasyElection(32, 1);
        assertNull(fantasyElection);
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
        @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyElection/insertFantasyElection.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsDriver/insertFantasyPointsDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsTeam/insertFantasyPointsTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceDriver/insertFantasyPriceDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceTeam/insertFantasyPriceTeam.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getFantasyPoints() {
        List<FantasyPointsUserDTO> fantasyPoints = this.fantasyController.getFantasyPoints(30, 2);
        assertNotNull(fantasyPoints);
        assertFalse(fantasyPoints.isEmpty());
        assertEquals(28, fantasyPoints.get(0).getTotalPoints());

        fantasyPoints = this.fantasyController.getFantasyPoints(30, null);
        assertNotNull(fantasyPoints);
        assertFalse(fantasyPoints.isEmpty());
        assertEquals(28, fantasyPoints.get(0).getTotalPoints());

        fantasyPoints = this.fantasyController.getFantasyPoints(0, null);
        assertNotNull(fantasyPoints);
        assertFalse(fantasyPoints.isEmpty());
        assertEquals(178, fantasyPoints.get(0).getTotalPoints());
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
        @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyElection/insertFantasyElection.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsDriver/insertFantasyPointsDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsTeam/insertFantasyPointsTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceDriver/insertFantasyPriceDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceTeam/insertFantasyPriceTeam.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getDriverPrices() {
        List<FantasyPriceDriverDTO> fantasyPriceDriver = this.fantasyController.getDriverPrices(22);
        assertNotNull(fantasyPriceDriver);
        assertFalse(fantasyPriceDriver.isEmpty());
        assertEquals(21476190, fantasyPriceDriver.get(0).getPrice());
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
        @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyElection/insertFantasyElection.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsDriver/insertFantasyPointsDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsTeam/insertFantasyPointsTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceDriver/insertFantasyPriceDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceTeam/insertFantasyPriceTeam.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getTeamPrices() {
        List<FantasyPriceTeamDTO> fantasyPriceTeam = this.fantasyController.getTeamPrice(11);
        assertNotNull(fantasyPriceTeam);
        assertFalse(fantasyPriceTeam.isEmpty());
        assertEquals(10609303, fantasyPriceTeam.get(0).getPrice());
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
        @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyElection/insertFantasyElection.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsDriver/insertFantasyPointsDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsTeam/insertFantasyPointsTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceDriver/insertFantasyPriceDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceTeam/insertFantasyPriceTeam.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getDriverPoints() {
        List<FantasyPointsDriverDTO> fantasyPointDriver = this.fantasyController.getDriverPoints(22);
        assertNotNull(fantasyPointDriver);
        assertFalse(fantasyPointDriver.isEmpty());
        assertEquals(12, fantasyPointDriver.get(0).getPoints());
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
        @Sql(value = "classpath:testsData/account/insertAccount.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyElection/insertFantasyElection.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsDriver/insertFantasyPointsDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPointsTeam/insertFantasyPointsTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceDriver/insertFantasyPriceDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/fantasyPriceTeam/insertFantasyPriceTeam.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getTeamPoints() {
        List<FantasyPointsTeamDTO> fantasyPointsTeam = this.fantasyController.getTeamPoints(11);
        assertNotNull(fantasyPointsTeam);
        assertFalse(fantasyPointsTeam.isEmpty());
        assertEquals(2, fantasyPointsTeam.get(0).getPoints());
    }
}
