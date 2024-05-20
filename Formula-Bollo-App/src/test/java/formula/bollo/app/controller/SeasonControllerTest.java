package formula.bollo.app.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
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
import formula.bollo.app.model.SeasonDTO;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class SeasonControllerTest {
    
    @Autowired
    private SeasonController seasonController;

    @Test
    @DirtiesContext
    @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD)
    void getAllSeasons() {
        List<SeasonDTO> seasons = this.seasonController.getAllSeasons();
        assertNotNull(seasons);
        assertFalse(seasons.isEmpty());

        SeasonDTO firstSeason = seasons.get(0);
        assertNotNull(firstSeason);
        assertEquals(1, firstSeason.getNumber());
    }

    @Test
    @DirtiesContext
    @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD)
    void getActualSeason() {
        SeasonDTO season = this.seasonController.getActualSeason();
        assertNotNull(season);
        assertEquals(2, season.getNumber());
    }

    @Test
    @DirtiesContext
    void getActualSeasonNotFound() {
        SeasonDTO season = this.seasonController.getActualSeason();
        assertNull(season);
    }

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/team/insertTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/driver/insertDriver.sql", executionPhase = BEFORE_TEST_METHOD)
    })
    void getSeasonByDriverName() {
        List<SeasonDTO> seasons = this.seasonController.seasonsByDriverName("Avantifer");
        assertNotNull(seasons);
        assertFalse(seasons.isEmpty());
        assertEquals(2, seasons.size());
    }
    
    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/team/insertTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/driver/insertDriver.sql", executionPhase = BEFORE_TEST_METHOD)
    })
    void getSeasonByDriverNameEmpty() {
        List<SeasonDTO> seasons = this.seasonController.seasonsByDriverName("Ferchis");
        assertNotNull(seasons);
        assertTrue(seasons.isEmpty());
    }

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/team/insertTeam.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getSeasonByTeamName() {
        List<SeasonDTO> seasons = this.seasonController.seasonsByTeamName("Aston Martin");
        assertNotNull(seasons);
        assertFalse(seasons.isEmpty());
        assertEquals(2, seasons.size());
    }
    
    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/team/insertTeam.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getSeasonByTeamNameEmpty() {
        List<SeasonDTO> seasons = this.seasonController.seasonsByTeamName("Aston Martin2");
        assertNotNull(seasons);
        assertTrue(seasons.isEmpty());
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
        @Sql(value = "classpath:testsData/fantasyElection/insertFantasyElection.sql", executionPhase = BEFORE_TEST_METHOD)
    })
    void getSeasonsOfFantasy()  {
        List<SeasonDTO> seasons = this.seasonController.seasonsOfFantasy();
        assertNotNull(seasons);
        assertFalse(seasons.isEmpty());

        SeasonDTO firstSeason = seasons.get(0);
        assertNotNull(firstSeason);
        assertEquals(2, firstSeason.getNumber());
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
    })
    void getSeasonsOfFantasyEmpty()  {
        List<SeasonDTO> seasons = this.seasonController.seasonsOfFantasy();
        assertNotNull(seasons);
        assertTrue(seasons.isEmpty());
    }
}
