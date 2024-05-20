package formula.bollo.app.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.BEFORE_TEST_METHOD;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.SqlGroup;

import formula.bollo.app.FormulaBolloAppApplication;
import formula.bollo.app.model.TeamDTO;
import formula.bollo.app.model.TeamInfoDTO;
import formula.bollo.app.model.TeamWithDriversDTO;
import formula.bollo.app.utils.Constants;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class TeamControllerTest {
    
    @Autowired
    private TeamsController teamsController;

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/team/insertTeam.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getAllTeams() {
        List<TeamDTO> teams = this.teamsController.getAllTeams(1);
        assertNotNull(teams);
        assertFalse(teams.isEmpty());
        assertEquals(10, teams.size());

        teams = this.teamsController.getAllTeams(null);
        assertNotNull(teams);
        assertFalse(teams.isEmpty());
        assertEquals(11, teams.size());

        teams = this.teamsController.getAllTeams(Constants.ACTUAL_SEASON);
        assertNotNull(teams);
        assertFalse(teams.isEmpty());
        assertEquals(11, teams.size());
    }

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/team/insertTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/driver/insertDriver.sql", executionPhase = BEFORE_TEST_METHOD)
    })
    void getAllTeamsWithDrivers() {
        List<TeamWithDriversDTO> teams = this.teamsController.getAllTeamWithDrivers(1);
        assertNotNull(teams);
        assertFalse(teams.isEmpty());
        assertEquals(10, teams.size());

        TeamWithDriversDTO firstTeam = teams.get(0);
        assertNotNull(firstTeam.getDriver1());
        assertNotNull(firstTeam.getDriver2());

        teams = this.teamsController.getAllTeamWithDrivers(null);
        assertNotNull(firstTeam.getDriver1());
        assertNotNull(firstTeam.getDriver2());
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
        @Sql(value = "classpath:testsData/constructor/insertConstructor.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/sprintPosition/insertSprintPosition.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/sprint/insertSprint.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penalty/insertPenalty.sql", executionPhase = BEFORE_TEST_METHOD)
    })
    void getDriverInfo() {
        TeamInfoDTO teamInfo = this.teamsController.getinfoTeamByName(1, "Aston Martin");
        assertNotNull(teamInfo);
        assertEquals(7, teamInfo.getPoles());
        assertEquals(4, teamInfo.getFastlaps());
        assertEquals(30, teamInfo.getRacesFinished());
        assertEquals(376, teamInfo.getTotalPoints());
        assertEquals(0, teamInfo.getChampionships());
        assertEquals(1, teamInfo.getPenalties());
        assertEquals(1, teamInfo.getBestPosition());
        assertEquals(2, teamInfo.getVictories());
        assertEquals(11, teamInfo.getPodiums());
        assertEquals(0, teamInfo.getConstructors());

        teamInfo = this.teamsController.getinfoTeamByName(null, "Aston Martin");
        assertNotNull(teamInfo);
        assertEquals(7, teamInfo.getPoles());
        assertEquals(4, teamInfo.getFastlaps());
        assertEquals(38, teamInfo.getRacesFinished());
        assertEquals(444, teamInfo.getTotalPoints());
        assertEquals(0, teamInfo.getChampionships());
        assertEquals(3, teamInfo.getPenalties());
        assertEquals(1, teamInfo.getBestPosition());
        assertEquals(2, teamInfo.getVictories());
        assertEquals(13, teamInfo.getPodiums());
        assertEquals(0, teamInfo.getConstructors());
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
        @Sql(value = "classpath:testsData/constructor/insertConstructor.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/sprintPosition/insertSprintPosition.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/sprint/insertSprint.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/penalty/insertPenalty.sql", executionPhase = BEFORE_TEST_METHOD)
    })
    void getAllTeamInfo() {
        List<TeamInfoDTO> teamsInfo = this.teamsController.getAllInfoTeam(1);
        assertNotNull(teamsInfo);
        assertFalse(teamsInfo.isEmpty());
        assertEquals(1, teamsInfo.get(0).getTeam().getSeason().getNumber());

        teamsInfo = this.teamsController.getAllInfoTeam(null);
        assertNotNull(teamsInfo);
        assertFalse(teamsInfo.isEmpty());
        assertEquals(2, teamsInfo.get(0).getTeam().getSeason().getNumber());
    }
}
