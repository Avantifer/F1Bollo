package formula.bollo.app.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import formula.bollo.app.FormulaBolloAppApplication;
import formula.bollo.app.model.ConstructorDTO;
import formula.bollo.app.model.SeasonDTO;
import formula.bollo.app.model.TeamDTO;
import nl.jqno.equalsverifier.EqualsVerifier;
import nl.jqno.equalsverifier.Warning;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class ConstructorTest {
    
    @Test
    void testConstructorAnnotations() {
        Team team = new Team();
        Season season = new Season();

        Constructor constructor = new Constructor();
        constructor.setId(1L);
        constructor.setTeam(team);
        constructor.setSeason(season);

        // @Getter
        assertEquals(1L, constructor.getId());
        assertEquals(team, constructor.getTeam());
        assertEquals(season, constructor.getSeason());

        // @Setter
        Team newTeam = new Team();
        Season newSeason = new Season();

        constructor.setTeam(newTeam);
        constructor.setSeason(newSeason);

        assertEquals(newTeam, constructor.getTeam());
        assertEquals(newSeason, constructor.getSeason());

        // @ToString
        String expectedToString = "Constructor(id=1, team=" + newTeam + ", season=" + newSeason + ")";
        assertEquals(expectedToString, constructor.toString());

        // @AllArgsConstructor
        Constructor allArgsConstructor = new Constructor(1L, newTeam, newSeason);
        assertEquals(constructor, allArgsConstructor);

        // @NoArgsConstructor
        Constructor noArgsConstructor = new Constructor();
        assertNotNull(noArgsConstructor);

        // @EqualsAndHashCode
        EqualsVerifier.forClass(Constructor.class).suppress(Warning.ALL_FIELDS_SHOULD_BE_USED).verify();
    }

    @Test
    void testConstructorDTOAnnotations() {
        TeamDTO team = new TeamDTO();
        SeasonDTO season = new SeasonDTO();

        ConstructorDTO constructor = new ConstructorDTO();
        constructor.setId(1L);
        constructor.setTeam(team);
        constructor.setSeason(season);

        // @Getter
        assertEquals(1L, constructor.getId());
        assertEquals(team, constructor.getTeam());
        assertEquals(season, constructor.getSeason());

        // @Setter
        TeamDTO newTeam = new TeamDTO();
        SeasonDTO newSeason = new SeasonDTO();

        constructor.setTeam(newTeam);
        constructor.setSeason(newSeason);

        assertEquals(newTeam, constructor.getTeam());
        assertEquals(newSeason, constructor.getSeason());

        // @ToString
        String expectedToString = "ConstructorDTO(id=1, team=" + newTeam + ", season=" + newSeason + ")";
        assertEquals(expectedToString, constructor.toString());

        // @AllArgsConstructor
        ConstructorDTO allArgsConstructor = new ConstructorDTO(1L, newTeam, newSeason);
        assertEquals(constructor, allArgsConstructor);

        // @NoArgsConstructor
        ConstructorDTO noArgsConstructor = new ConstructorDTO();
        assertNotNull(noArgsConstructor);

        // @EqualsAndHashCode
        EqualsVerifier.simple().forClass(ConstructorDTO.class).verify();
    }
}
