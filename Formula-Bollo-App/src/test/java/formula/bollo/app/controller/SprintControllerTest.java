package formula.bollo.app.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.SqlGroup;

import formula.bollo.app.FormulaBolloAppApplication;
import formula.bollo.app.model.SprintDTO;
import formula.bollo.app.model.SprintPositionDTO;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.BEFORE_TEST_METHOD;

import java.util.ArrayList;
import java.util.List;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class SprintControllerTest {

    @Autowired
    private SprintController sprintController;


    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/team/insertTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/driver/insertDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/circuit/insertCircuit.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/race/insertRace.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/sprintPosition/insertSprintPosition.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/sprint/insertSprint.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getListSprintEmpty() {
        // No race found
        List<SprintDTO> sprints = this.sprintController.getSprintsPerCircuit(14, 2);
        assertNotNull(sprints);
        assertTrue(sprints.isEmpty());

        // No sprints found
        sprints = this.sprintController.getSprintsPerCircuit(18, 1);
        assertNotNull(sprints);
        assertTrue(sprints.isEmpty());
    }

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/team/insertTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/driver/insertDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/circuit/insertCircuit.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/race/insertRace.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/sprintPosition/insertSprintPosition.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/sprint/insertSprint.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void getListSprint() {
        List<SprintDTO> sprints = this.sprintController.getSprintsPerCircuit(14, 1);
        assertNotNull(sprints);
        assertFalse(sprints.isEmpty());
        assertEquals(20, sprints.size());

        sprints = this.sprintController.getSprintsPerCircuit(30, null);
        assertNotNull(sprints);
        assertFalse(sprints.isEmpty());
        assertEquals(20, sprints.size());
    }

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/team/insertTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/driver/insertDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/circuit/insertCircuit.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/race/insertRace.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/sprintPosition/insertSprintPosition.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/sprint/insertSprint.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void saveSprint() {
        List<SprintDTO> sprints = this.sprintController.getSprintsPerCircuit(14, 1);
        assertNotNull(sprints);
        assertFalse(sprints.isEmpty());
        assertEquals(20, sprints.size());
        sprints.get(3).setPosition(new SprintPositionDTO(6, 6, 3));
        sprints.get(9).setPosition(new SprintPositionDTO(5, 5, 4));
        ResponseEntity<String> response = this.sprintController.saveSprintsCircuit(sprints, 1);        
        assertEquals("Resultados guardados correctamente", response.getBody());
    }

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/team/insertTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/driver/insertDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/circuit/insertCircuit.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/race/insertRace.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/sprintPosition/insertSprintPosition.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/sprint/insertSprint.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void saveSprintErrorGeneric() {
        List<SprintDTO> sprints = this.sprintController.getSprintsPerCircuit(14, 1);
        assertNotNull(sprints);
        assertFalse(sprints.isEmpty());
        assertEquals(20, sprints.size());
        sprints.get(3).setPosition(new SprintPositionDTO(6, 6, 3));
        sprints.get(9).setPosition(new SprintPositionDTO(5, 5, 4));
        ResponseEntity<String> response = this.sprintController.saveSprintsCircuit(sprints, null);        
        assertEquals("Hubo un error. Contacta con el administrador", response.getBody());
    }

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/team/insertTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/driver/insertDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/circuit/insertCircuit.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/race/insertRace.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/sprintPosition/insertSprintPosition.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/sprint/insertSprint.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void saveSprintSeasonError() {
        List<SprintDTO> sprints = this.sprintController.getSprintsPerCircuit(14, 1);
        assertNotNull(sprints);
        assertFalse(sprints.isEmpty());
        assertEquals(20, sprints.size());
        sprints.get(3).setPosition(new SprintPositionDTO(6, 6, 3));
        sprints.get(9).setPosition(new SprintPositionDTO(5, 5, 4));
        ResponseEntity<String> response = this.sprintController.saveSprintsCircuit(sprints, 3);        
        assertEquals("Hubo un problema con las temporadas", response.getBody());
    }

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/team/insertTeam.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/driver/insertDriver.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/circuit/insertCircuit.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/race/insertRace.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/sprintPosition/insertSprintPosition.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/sprint/insertSprint.sql", executionPhase = BEFORE_TEST_METHOD),
    })
    void saveSprintEmptyError() {
        List<SprintDTO> sprints = new ArrayList<>();
        assertNotNull(sprints);
        assertTrue(sprints.isEmpty());
        ResponseEntity<String> response = this.sprintController.saveSprintsCircuit(sprints, null);        
        assertEquals("No hay resultados", response.getBody());
    }
}