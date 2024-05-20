package formula.bollo.app.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.SqlGroup;

import formula.bollo.app.model.CircuitDTO;
import formula.bollo.app.utils.Constants;
import formula.bollo.app.FormulaBolloAppApplication;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.BEFORE_TEST_METHOD;

import java.util.List;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class CircuitControllerTest {
    
    @Autowired
    private CircuitController circuitController;

    @Test
    @DirtiesContext
    void getCircuitsEmpty() {
        List<CircuitDTO> circuits =  this.circuitController.getAllCircuits(1);
        assertNotNull(circuits);
        assertEquals(0, circuits.size());
        assertTrue(circuits.isEmpty());
    }

    @Test
    @DirtiesContext
    @SqlGroup({
        @Sql(value = "classpath:testsData/season/insertSeason.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:testsData/circuit/insertCircuit.sql", executionPhase = BEFORE_TEST_METHOD)
    }) 
    void getCircuitsNotEmpty() {
        List<CircuitDTO> circuits = this.circuitController.getAllCircuits(null);
        assertNotNull(circuits);
        assertEquals(24, circuits.size());
        assertFalse(circuits.isEmpty());

        // Está igual porque está guardada en caché
        circuits = this.circuitController.getAllCircuits(Constants.ACTUAL_SEASON);
        assertNotNull(circuits);
        assertEquals(24, circuits.size());
        assertFalse(circuits.isEmpty());
    }
}
