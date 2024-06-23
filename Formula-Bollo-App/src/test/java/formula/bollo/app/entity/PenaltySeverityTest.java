package formula.bollo.app.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import formula.bollo.app.FormulaBolloAppApplication;
import formula.bollo.app.model.PenaltySeverityDTO;
import nl.jqno.equalsverifier.EqualsVerifier;
import nl.jqno.equalsverifier.Warning;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class PenaltySeverityTest {

    @Test
    void testPenaltySeverityAnnotations() {
        PenaltySeverity penaltySeverity = new PenaltySeverity();
        penaltySeverity.setId(1L);
        penaltySeverity.setSeverity("Alta");

        // @Getter
        assertEquals(1L, penaltySeverity.getId());
        assertEquals("Alta", penaltySeverity.getSeverity());

        // @Setter
        penaltySeverity.setSeverity("Baja");
        assertEquals("Baja", penaltySeverity.getSeverity());

        // @ToString
        String expectedToString = "PenaltySeverity(id=1, severity=Baja)";
        assertEquals(expectedToString, penaltySeverity.toString());

        // @AllArgsConstructor
        PenaltySeverity allArgsPenaltySeverity = new PenaltySeverity(1L, "Baja");
        assertEquals(penaltySeverity, allArgsPenaltySeverity);

        // @NoArgsConstructor
        PenaltySeverity noArgsConstructorPenaltySeverity = new PenaltySeverity();
        assertNotNull(noArgsConstructorPenaltySeverity);

        // @EqualsAndHashCode
        EqualsVerifier.forClass(PenaltySeverity.class).suppress(Warning.ALL_FIELDS_SHOULD_BE_USED).verify();
    }

    @Test
    void testPenaltySeverityDTO() {
        // Crear instancia de PenaltySeverityDTO
        PenaltySeverityDTO penaltySeverityDTO = new PenaltySeverityDTO();
        penaltySeverityDTO.setId(1L);
        penaltySeverityDTO.setSeverity("Alta");

        // @Getter
        assertEquals(1L, penaltySeverityDTO.getId());
        assertEquals("Alta", penaltySeverityDTO.getSeverity());

        // @Setter
        penaltySeverityDTO.setSeverity("Baja");
        assertEquals("Baja", penaltySeverityDTO.getSeverity());

        // @AllArgsConstructor
        PenaltySeverityDTO allArgsPenaltySeverityDTO = new PenaltySeverityDTO(1L, "Baja");
        assertEquals(penaltySeverityDTO, allArgsPenaltySeverityDTO);

        // @NoArgsConstructor
        PenaltySeverityDTO noArgsConstructorPenaltySeverityDTO = new PenaltySeverityDTO();
        assertNotNull(noArgsConstructorPenaltySeverityDTO);

        // @EqualsAndHashCode
        EqualsVerifier.simple().forClass(PenaltySeverityDTO.class).verify();
    }
}
