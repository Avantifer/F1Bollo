package formula.bollo.app.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;

import formula.bollo.app.FormulaBolloAppApplication;
import formula.bollo.app.model.PenaltySeverityDTO;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.BEFORE_TEST_METHOD;

import java.util.List;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class PenaltySeverityControllerTest {
    
    @Autowired
    private PenaltySeverityController penaltySeverityController;

    @Test
    void getAllPenaltySeverityEmpty() {
        List<PenaltySeverityDTO> penaltySeveritys = this.penaltySeverityController.getAllPenaltiesSeverity();
        assertNotNull(penaltySeveritys);
        assertEquals(0, penaltySeveritys.size());
    }

    @Test
    @Sql(value = "classpath:testsData/penaltySeverity/insertPenaltySeverity.sql", executionPhase = BEFORE_TEST_METHOD)
    void getAllPenaltySeverityNotEmpty() {
        List<PenaltySeverityDTO> penaltySeveritys = this.penaltySeverityController.getAllPenaltiesSeverity();
        assertNotNull(penaltySeveritys);
        assertEquals(3, penaltySeveritys.size());
        assertEquals("Aviso", penaltySeveritys.get(0).getSeverity());
    }
}
