package formula.bollo.app.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.time.LocalDateTime;
import java.util.Date;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import formula.bollo.app.FormulaBolloAppApplication;
import formula.bollo.app.model.CircuitDTO;
import formula.bollo.app.model.RaceDTO;
import formula.bollo.app.model.SeasonDTO;
import nl.jqno.equalsverifier.EqualsVerifier;
import nl.jqno.equalsverifier.Warning;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class RaceTest {
    
    @Test
    void testRaceAnnotations() {
        Circuit circuit = new Circuit();
        Date dateStart = new Date();
        Season season = new Season();

        Race race = new Race();
        race.setId(1L);
        race.setCircuit(circuit);
        race.setDateStart(dateStart);
        race.setFinished(0);
        race.setSeason(season);

        // @Getter
        assertEquals(1L, race.getId());
        assertEquals(circuit, race.getCircuit());
        assertEquals(dateStart, race.getDateStart());
        assertEquals(0, race.getFinished());
        assertEquals(season, race.getSeason());

        // @Setter
        Circuit newCircuit = new Circuit();
        Date newDateStart = new Date(System.currentTimeMillis() + 1000000L);
        Season newSeason = new Season();

        race.setCircuit(newCircuit);
        race.setDateStart(newDateStart);
        race.setFinished(1);
        race.setSeason(newSeason);

        assertEquals(newCircuit, race.getCircuit());
        assertEquals(newDateStart, race.getDateStart());
        assertEquals(1, race.getFinished());
        assertEquals(newSeason, race.getSeason());

        // @ToString
        String expectedToString = "Race(id=1, circuit=" + newCircuit + ", dateStart=" + newDateStart + ", finished=1, season=" + newSeason + ")";
        assertEquals(expectedToString, race.toString());

        // @AllArgsConstructor
        Race allArgsConstructor = new Race(1L, newCircuit, newDateStart, 1, newSeason);
        assertEquals(race, allArgsConstructor);

        // @NoArgsConstructor
        Race noArgsConstructor = new Race();
        assertNotNull(noArgsConstructor);

        // @EqualsAndHashCode
        EqualsVerifier.forClass(Race.class).suppress(Warning.ALL_FIELDS_SHOULD_BE_USED).verify();
    }

     @Test
    void testRaceDTOAnnotations() {
        CircuitDTO circuitDTO = new CircuitDTO();
        LocalDateTime dateStart = LocalDateTime.now();
        SeasonDTO seasonDTO = new SeasonDTO();

        RaceDTO raceDTO = new RaceDTO();
        raceDTO.setId(1L);
        raceDTO.setCircuit(circuitDTO);
        raceDTO.setDateStart(dateStart);
        raceDTO.setFinished(0);
        raceDTO.setSeason(seasonDTO);

        // @Getter
        assertEquals(1L, raceDTO.getId());
        assertEquals(circuitDTO, raceDTO.getCircuit());
        assertEquals(dateStart, raceDTO.getDateStart());
        assertEquals(0, raceDTO.getFinished());
        assertEquals(seasonDTO, raceDTO.getSeason());

        // @Setter
        CircuitDTO newCircuitDTO = new CircuitDTO();
        LocalDateTime newDateStart = LocalDateTime.now().plusSeconds(1000000L);
        SeasonDTO newSeasonDTO = new SeasonDTO();

        raceDTO.setCircuit(newCircuitDTO);
        raceDTO.setDateStart(newDateStart);
        raceDTO.setFinished(1);
        raceDTO.setSeason(newSeasonDTO);

        assertEquals(newCircuitDTO, raceDTO.getCircuit());
        assertEquals(newDateStart, raceDTO.getDateStart());
        assertEquals(1, raceDTO.getFinished());
        assertEquals(newSeasonDTO, raceDTO.getSeason());

        // @AllArgsConstructor
        RaceDTO allArgsConstructor = new RaceDTO(1L, newCircuitDTO, newDateStart, newSeasonDTO, 1);
        assertEquals(raceDTO, allArgsConstructor);

        // @NoArgsConstructor
        RaceDTO noArgsConstructor = new RaceDTO();
        assertNotNull(noArgsConstructor);

        // @EqualsAndHashCode
        EqualsVerifier.simple().forClass(RaceDTO.class).verify();   
    }
}
