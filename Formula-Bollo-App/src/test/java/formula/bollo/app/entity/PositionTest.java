package formula.bollo.app.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import formula.bollo.app.FormulaBolloAppApplication;
import formula.bollo.app.model.PositionDTO;
import nl.jqno.equalsverifier.EqualsVerifier;
import nl.jqno.equalsverifier.Warning;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class PositionTest {
    
    @Test
    void testPositionAnnotations() {
        Position position = new Position();
        position.setId(1L);
        position.setPositionNumber(2);
        position.setPoints(10);

        // @Getter
        assertEquals(1L, position.getId());
        assertEquals(2, position.getPositionNumber());
        assertEquals(10, position.getPoints());

        // @Setter
        position.setPositionNumber(3);
        position.setPoints(15);
        assertEquals(3, position.getPositionNumber());
        assertEquals(15, position.getPoints());

        // @ToString
        String expectedToString = "Position(id=1, positionNumber=3, points=15)";
        assertEquals(expectedToString, position.toString());

        // @AllArgsConstructor
        Position allArgsPosition = new Position(1L, 3, 15);
        assertEquals(position, allArgsPosition);

        // @NoArgsConstructor
        Position noArgsConstructorPosition = new Position();
        assertNotNull(noArgsConstructorPosition);

        // @EqualsAndHashCode
        EqualsVerifier.forClass(Position.class).suppress(Warning.ALL_FIELDS_SHOULD_BE_USED).verify();
    }

    @Test
    void testPositionDTO() {
        PositionDTO positionDTO = new PositionDTO();
        positionDTO.setId(1);
        positionDTO.setPositionNumber(2);
        positionDTO.setPoints(10);

        // @Getter
        assertEquals(1, positionDTO.getId());
        assertEquals(2, positionDTO.getPositionNumber());
        assertEquals(10, positionDTO.getPoints());

        // @Setter
        positionDTO.setPositionNumber(3);
        positionDTO.setPoints(15);
        assertEquals(3, positionDTO.getPositionNumber());
        assertEquals(15, positionDTO.getPoints());

        // @ToString
        String expectedToString = "PositionDTO(id=1, positionNumber=3, points=15)";
        assertEquals(expectedToString, positionDTO.toString());

        // @AllArgsConstructor
        PositionDTO allArgsPositionDTO = new PositionDTO(1, 3, 15);
        assertEquals(positionDTO, allArgsPositionDTO);

        // @NoArgsConstructor
        PositionDTO noArgsConstructorPositionDTO = new PositionDTO();
        assertNotNull(noArgsConstructorPositionDTO);

        // @EqualsAndHashCode
        EqualsVerifier.simple().forClass(PositionDTO.class).verify();    
    }
}
