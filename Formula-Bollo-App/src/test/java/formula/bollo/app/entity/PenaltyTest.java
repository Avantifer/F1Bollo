package formula.bollo.app.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import formula.bollo.app.FormulaBolloAppApplication;
import formula.bollo.app.model.DriverDTO;
import formula.bollo.app.model.PenaltyDTO;
import formula.bollo.app.model.PenaltySeverityDTO;
import formula.bollo.app.model.RaceDTO;
import formula.bollo.app.model.SeasonDTO;
import nl.jqno.equalsverifier.EqualsVerifier;
import nl.jqno.equalsverifier.Warning;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class PenaltyTest {
    
    @Test
    void testPenaltyAnnotations() {
        Race race = new Race();
        Driver driver = new Driver();
        PenaltySeverity severity = new PenaltySeverity();
        Season season = new Season();

        Penalty penalty = new Penalty();
        penalty.setId(1L);
        penalty.setRace(race);
        penalty.setDriver(driver);
        penalty.setReason("Speeding");
        penalty.setSeverity(severity);
        penalty.setSeason(season);

        // @Getter
        assertEquals(1L, penalty.getId());
        assertEquals(race, penalty.getRace());
        assertEquals(driver, penalty.getDriver());
        assertEquals("Speeding", penalty.getReason());
        assertEquals(severity, penalty.getSeverity());
        assertEquals(season, penalty.getSeason());

        // @Setter
        Race newRace = new Race();
        Driver newDriver = new Driver();
        PenaltySeverity newSeverity = new PenaltySeverity();
        Season newSeason = new Season();

        penalty.setRace(newRace);
        penalty.setDriver(newDriver);
        penalty.setReason("Unsafe driving");
        penalty.setSeverity(newSeverity);
        penalty.setSeason(newSeason);

        assertEquals(newRace, penalty.getRace());
        assertEquals(newDriver, penalty.getDriver());
        assertEquals("Unsafe driving", penalty.getReason());
        assertEquals(newSeverity, penalty.getSeverity());
        assertEquals(newSeason, penalty.getSeason());

        // @ToString
        String expectedToString = "Penalty(id=1, race=" + newRace + ", driver=" + newDriver + ", reason=Unsafe driving, severity=" + newSeverity + ", season=" + newSeason + ")";
        assertEquals(expectedToString, penalty.toString());

        // @AllArgsConstructor
        Penalty allArgsConstructor = new Penalty(1L, newRace, newDriver, "Unsafe driving", newSeverity, newSeason);
        assertEquals(penalty, allArgsConstructor);

        // @NoArgsConstructor
        Penalty noArgsConstructor = new Penalty();
        assertNotNull(noArgsConstructor);

        // @EqualsAndHashCode
        EqualsVerifier.forClass(Penalty.class).suppress(Warning.ALL_FIELDS_SHOULD_BE_USED).verify();
    }

    @Test
    void testPenaltyDTOAnnotations() {
        RaceDTO raceDTO = new RaceDTO();
        DriverDTO driverDTO = new DriverDTO();
        PenaltySeverityDTO severityDTO = new PenaltySeverityDTO();
        SeasonDTO seasonDTO = new SeasonDTO();

        PenaltyDTO penaltyDTO = new PenaltyDTO();
        penaltyDTO.setId(1L);
        penaltyDTO.setRace(raceDTO);
        penaltyDTO.setDriver(driverDTO);
        penaltyDTO.setReason("Speeding");
        penaltyDTO.setSeverity(severityDTO);
        penaltyDTO.setSeason(seasonDTO);

        // @Getter
        assertEquals(1L, penaltyDTO.getId());
        assertEquals(raceDTO, penaltyDTO.getRace());
        assertEquals(driverDTO, penaltyDTO.getDriver());
        assertEquals("Speeding", penaltyDTO.getReason());
        assertEquals(severityDTO, penaltyDTO.getSeverity());
        assertEquals(seasonDTO, penaltyDTO.getSeason());

        // @Setter
        RaceDTO newRaceDTO = new RaceDTO();
        DriverDTO newDriverDTO = new DriverDTO();
        PenaltySeverityDTO newSeverityDTO = new PenaltySeverityDTO();
        SeasonDTO newSeasonDTO = new SeasonDTO();

        penaltyDTO.setRace(newRaceDTO);
        penaltyDTO.setDriver(newDriverDTO);
        penaltyDTO.setReason("Unsafe driving");
        penaltyDTO.setSeverity(newSeverityDTO);
        penaltyDTO.setSeason(newSeasonDTO);

        assertEquals(newRaceDTO, penaltyDTO.getRace());
        assertEquals(newDriverDTO, penaltyDTO.getDriver());
        assertEquals("Unsafe driving", penaltyDTO.getReason());
        assertEquals(newSeverityDTO, penaltyDTO.getSeverity());
        assertEquals(newSeasonDTO, penaltyDTO.getSeason());

        // @ToString
        String expectedToStringDTO = "PenaltyDTO(id=1, race=" + newRaceDTO + ", driver=" + newDriverDTO + ", reason=Unsafe driving, severity=" + newSeverityDTO + ", season=" + newSeasonDTO + ")";
        assertEquals(expectedToStringDTO, penaltyDTO.toString());

        // @AllArgsConstructor
        PenaltyDTO allArgsConstructorDTO = new PenaltyDTO(1L, newRaceDTO, newDriverDTO, "Unsafe driving", newSeverityDTO, newSeasonDTO);
        assertEquals(penaltyDTO, allArgsConstructorDTO);

        // @NoArgsConstructor
        PenaltyDTO noArgsConstructorDTO = new PenaltyDTO();
        assertNotNull(noArgsConstructorDTO);

        // @EqualsAndHashCode
        EqualsVerifier.simple().forClass(PenaltyDTO.class).verify();    
    }
}
