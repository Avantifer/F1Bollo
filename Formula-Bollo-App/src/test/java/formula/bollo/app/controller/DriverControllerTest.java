package formula.bollo.app.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.BEFORE_TEST_METHOD;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.SqlGroup;

import formula.bollo.app.FormulaBolloAppApplication;
import formula.bollo.app.model.DriverDTO;
import formula.bollo.app.model.DriverInfoDTO;

import java.util.List;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class DriverControllerTest {
    
    @Autowired
    private DriverController driverController;


    @Test
    @DirtiesContext
    void getAllDriversEmpty() {
        List<DriverDTO> drivers = this.driverController.getAllDrivers(null);
        assertNotNull(drivers);
        assertEquals(0, drivers.size());
        assertTrue(drivers.isEmpty());
    }

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/team/insertTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/driver/insertDriver.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getAllDrivers() {
        List<DriverDTO> drivers = this.driverController.getAllDrivers(1);
        assertNotNull(drivers);
        assertEquals(21, drivers.size());
        assertFalse(drivers.isEmpty());
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
        @Sql(value = "classpath:testsData/championship/insertChampionship.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/sprintPosition/insertSprintPosition.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/sprint/insertSprint.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penalty/insertPenalty.sql", executionPhase = BEFORE_TEST_METHOD)
    })
    void getDriverInfo() {
        DriverInfoDTO driverInfo = this.driverController.getinfoDriverByName(1, "Bubapu");
        assertNotNull(driverInfo);
        assertEquals("Bubapu", driverInfo.getDriver().getName());
        assertEquals(1, driverInfo.getDriver().getSeason().getNumber());
        assertEquals(3, driverInfo.getPoles());
        assertEquals(3, driverInfo.getFastlaps());
        assertEquals(22, driverInfo.getRacesFinished());
        assertEquals(388, driverInfo.getTotalPoints());
        assertEquals(1, driverInfo.getChampionships());
        assertEquals(1, driverInfo.getPenalties());
        assertEquals(1, driverInfo.getBestPosition());
        assertEquals(6, driverInfo.getVictories());
        assertEquals(13, driverInfo.getPodiums());

        driverInfo = this.driverController.getinfoDriverByName(null, "Bubapu");
        assertNotNull(driverInfo);
        assertEquals("Bubapu", driverInfo.getDriver().getName());
        assertEquals(2, driverInfo.getDriver().getSeason().getNumber());
        assertEquals(3, driverInfo.getPoles());
        assertEquals(3, driverInfo.getFastlaps());
        assertEquals(26, driverInfo.getRacesFinished());
        assertEquals(457, driverInfo.getTotalPoints());
        assertEquals(1, driverInfo.getChampionships());
        assertEquals(1, driverInfo.getPenalties());
        assertEquals(1, driverInfo.getBestPosition());
        assertEquals(6, driverInfo.getVictories());
        assertEquals(16, driverInfo.getPodiums());
    }

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/team/insertTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/driver/insertDriver.sql", executionPhase = BEFORE_TEST_METHOD)
    })
    void getDriversOfTeam() {
        List<DriverDTO> drivers = this.driverController.getDriversByTeam(1);
        DriverDTO driverOne = drivers.get(0);
        DriverDTO driverTwo = drivers.get(1);
        assertNotNull(drivers);
        assertFalse(drivers.isEmpty());

        assertNotNull(driverOne);
        assertEquals(1, driverOne.getSeason().getNumber());
        assertEquals("Dani Calde", driverOne.getName());
        assertEquals(9, driverOne.getNumber());
        assertEquals("Mercedes", driverOne.getTeam().getName());

        assertNotNull(driverTwo);
        assertEquals(1, driverTwo.getSeason().getNumber());
        assertEquals("WenDiego", driverTwo.getName());
        assertEquals(69, driverTwo.getNumber());
        assertEquals("Mercedes", driverTwo.getTeam().getName());
    }

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/team/insertTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/driver/insertDriver.sql", executionPhase = BEFORE_TEST_METHOD)
    })
    void getDriversOfTeamEmpty() {
        List<DriverDTO> drivers = this.driverController.getDriversByTeam(30);
        assertNotNull(drivers);
        assertTrue(drivers.isEmpty());
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
        @Sql(value = "classpath:testsData/championship/insertChampionship.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/sprintPosition/insertSprintPosition.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/sprint/insertSprint.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penalty/insertPenalty.sql", executionPhase = BEFORE_TEST_METHOD)
    })
    void getListDriverInfo() {
        List<DriverInfoDTO> driversInfo = this.driverController.getAllInfoDriver(1);
        assertNotNull(driversInfo);
        assertFalse(driversInfo.isEmpty());
        assertEquals(1, driversInfo.get(0).getDriver().getSeason().getNumber());

        driversInfo = this.driverController.getAllInfoDriver(null);
        assertNotNull(driversInfo);
        assertFalse(driversInfo.isEmpty());
        assertEquals(2, driversInfo.get(0).getDriver().getSeason().getNumber());
    }
}
