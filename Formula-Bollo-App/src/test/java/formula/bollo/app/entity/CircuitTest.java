package formula.bollo.app.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;

import java.sql.Blob;

import org.junit.jupiter.api.Test;

import formula.bollo.app.model.CircuitDTO;
import formula.bollo.app.model.SeasonDTO;
import nl.jqno.equalsverifier.EqualsVerifier;
import nl.jqno.equalsverifier.Warning;

class CircuitTest {

    @Test
    void testCircuitAnnotations() {
        Season season = new Season();
        Blob flagImage = mock(Blob.class);
        Blob circuitImage = mock(Blob.class);

        Circuit circuit = new Circuit();
        circuit.setId(1L);
        circuit.setName("Circuit Name");
        circuit.setCountry("Country Name");
        circuit.setFlagImage(flagImage);
        circuit.setCircuitImage(circuitImage);
        circuit.setSeason(season);

        // @Getter
        assertEquals(1L, circuit.getId());
        assertEquals("Circuit Name", circuit.getName());
        assertEquals("Country Name", circuit.getCountry());
        assertEquals(flagImage, circuit.getFlagImage());
        assertEquals(circuitImage, circuit.getCircuitImage());
        assertEquals(season, circuit.getSeason());

        // @Setter
        Season newSeason = new Season();
        Blob newFlagImage = mock(Blob.class);
        Blob newCircuitImage = mock(Blob.class);

        circuit.setName("New Circuit Name");
        circuit.setCountry("New Country Name");
        circuit.setFlagImage(newFlagImage);
        circuit.setCircuitImage(newCircuitImage);
        circuit.setSeason(newSeason);

        assertEquals("New Circuit Name", circuit.getName());
        assertEquals("New Country Name", circuit.getCountry());
        assertEquals(newFlagImage, circuit.getFlagImage());
        assertEquals(newCircuitImage, circuit.getCircuitImage());
        assertEquals(newSeason, circuit.getSeason());

        // @ToString
        String expectedToString = "Circuit(id=1, name=New Circuit Name, country=New Country Name, flagImage=" + newFlagImage + ", circuitImage=" + newCircuitImage + ", season=" + newSeason + ")";
        assertEquals(expectedToString, circuit.toString());

        // @AllArgsConstructor
        Circuit allArgsConstructor = new Circuit(1L, "New Circuit Name", "New Country Name", newFlagImage, newCircuitImage, newSeason);
        assertEquals(circuit, allArgsConstructor);

        // @NoArgsConstructor
        Circuit noArgsConstructor = new Circuit();
        assertNotNull(noArgsConstructor);

        // @EqualsAndHashCode
        EqualsVerifier.forClass(Circuit.class).suppress(Warning.ALL_FIELDS_SHOULD_BE_USED).verify();
    }

    @Test
    void testCircuitDTOAnnotations() {
        SeasonDTO seasonDTO = new SeasonDTO();
        String flagImage = "Flag Image URL";
        String circuitImage = "Circuit Image URL";

        CircuitDTO circuitDTO = new CircuitDTO();
        circuitDTO.setId(1L);
        circuitDTO.setName("Circuit Name");
        circuitDTO.setCountry("Country Name");
        circuitDTO.setFlagImage(flagImage);
        circuitDTO.setCircuitImage(circuitImage);
        circuitDTO.setSeason(seasonDTO);

        // @Getter
        assertEquals(1L, circuitDTO.getId());
        assertEquals("Circuit Name", circuitDTO.getName());
        assertEquals("Country Name", circuitDTO.getCountry());
        assertEquals(flagImage, circuitDTO.getFlagImage());
        assertEquals(circuitImage, circuitDTO.getCircuitImage());
        assertEquals(seasonDTO, circuitDTO.getSeason());

        // @Setter
        SeasonDTO newSeasonDTO = new SeasonDTO();
        String newFlagImage = "New Flag Image URL";
        String newCircuitImage = "New Circuit Image URL";

        circuitDTO.setName("New Circuit Name");
        circuitDTO.setCountry("New Country Name");
        circuitDTO.setFlagImage(newFlagImage);
        circuitDTO.setCircuitImage(newCircuitImage);
        circuitDTO.setSeason(newSeasonDTO);

        assertEquals("New Circuit Name", circuitDTO.getName());
        assertEquals("New Country Name", circuitDTO.getCountry());
        assertEquals(newFlagImage, circuitDTO.getFlagImage());
        assertEquals(newCircuitImage, circuitDTO.getCircuitImage());
        assertEquals(newSeasonDTO, circuitDTO.getSeason());

        // @AllArgsConstructor
        CircuitDTO allArgsConstructor = new CircuitDTO(1L, "New Circuit Name", "New Country Name", newFlagImage, newCircuitImage, newSeasonDTO);
        assertEquals(circuitDTO, allArgsConstructor);

        // @NoArgsConstructor
        CircuitDTO noArgsConstructor = new CircuitDTO();
        assertNotNull(noArgsConstructor);

        // @EqualsAndHashCode
        EqualsVerifier.simple().forClass(CircuitDTO.class).verify();
    }
}
