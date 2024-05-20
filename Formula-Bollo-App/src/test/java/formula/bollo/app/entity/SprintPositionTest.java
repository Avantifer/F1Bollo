package formula.bollo.app.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import formula.bollo.app.FormulaBolloAppApplication;
import formula.bollo.app.model.SprintPositionDTO;
import nl.jqno.equalsverifier.EqualsVerifier;
import nl.jqno.equalsverifier.Warning;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class SprintPositionTest {
    
    @Test
    void testSprintPositionAnnotations() {
        SprintPosition sprintPosition = new SprintPosition();
        sprintPosition.setId(1L);
        sprintPosition.setPositionNumber(2);
        sprintPosition.setPoints(10);

        // @Getter
        assertEquals(1L, sprintPosition.getId());
        assertEquals(2, sprintPosition.getPositionNumber());
        assertEquals(10, sprintPosition.getPoints());

        // @Setter
        sprintPosition.setPositionNumber(3);
        sprintPosition.setPoints(15);
        assertEquals(3, sprintPosition.getPositionNumber());
        assertEquals(15, sprintPosition.getPoints());

        // @ToString
        String expectedToString = "SprintPosition(id=1, positionNumber=3, points=15)";
        assertEquals(expectedToString, sprintPosition.toString());

        // @AllArgsConstructor
        SprintPosition allArgsSprintPosition = new SprintPosition(1L, 3, 15);
        assertEquals(sprintPosition, allArgsSprintPosition);

        // @NoArgsConstructor
        SprintPosition noArgsConstructorSprintPosition = new SprintPosition();
        assertNotNull(noArgsConstructorSprintPosition);

        // @EqualsAndHashCode
        EqualsVerifier.forClass(SprintPosition.class).suppress(Warning.ALL_FIELDS_SHOULD_BE_USED).verify();
    }

     @Test
    void testSprintPositionDTOAnnotations() {
        SprintPositionDTO sprintPositionDTO = new SprintPositionDTO();
        sprintPositionDTO.setId(1);
        sprintPositionDTO.setPositionNumber(2);
        sprintPositionDTO.setPoints(10);

        // @Getter
        assertEquals(1, sprintPositionDTO.getId());
        assertEquals(2, sprintPositionDTO.getPositionNumber());
        assertEquals(10, sprintPositionDTO.getPoints());

        // @Setter
        sprintPositionDTO.setPositionNumber(3);
        sprintPositionDTO.setPoints(15);
        assertEquals(3, sprintPositionDTO.getPositionNumber());
        assertEquals(15, sprintPositionDTO.getPoints());

        // @AllArgsConstructor
        SprintPositionDTO allArgsSprintPositionDTO = new SprintPositionDTO(1, 3, 15);
        assertEquals(sprintPositionDTO, allArgsSprintPositionDTO);

        // @NoArgsConstructor
        SprintPositionDTO noArgsConstructorSprintPositionDTO = new SprintPositionDTO();
        assertNotNull(noArgsConstructorSprintPositionDTO);

        // @EqualsAndHashCode
        EqualsVerifier.simple().forClass(SprintPositionDTO.class).verify(); 
    }
}
