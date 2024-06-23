package formula.bollo.app.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import formula.bollo.app.FormulaBolloAppApplication;
import formula.bollo.app.model.SeasonDTO;
import nl.jqno.equalsverifier.EqualsVerifier;
import nl.jqno.equalsverifier.Warning;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class SeasonTest {
    
    @Test
    void testSeasonAnnotations() {
        Season season = new Season();
        season.setId(1L);
        season.setName("Temporada 1");
        season.setNumber(1);

        // @Getter
        assertEquals(1L, season.getId());
        assertEquals("Temporada 1", season.getName());
        assertEquals(1, season.getNumber());

        // @Setter
        season.setName("Temporada 2");
        season.setNumber(2);
        assertEquals("Temporada 2", season.getName());
        assertEquals(2, season.getNumber());

        // @ToString
        String expectedToString = "Season(id=1, name=Temporada 2, number=2)";
        assertEquals(expectedToString, season.toString());

        // @AllArgsConstructor
        Season allArgsSeason = new Season(1L, "Temporada 2", 2);
        assertEquals(season, allArgsSeason);

        // @NoArgsConstructor
        Season noArgsConstructorSeason = new Season();
        assertNotNull(noArgsConstructorSeason);

        // @EqualsAndHashCode
        EqualsVerifier.forClass(Season.class).suppress(Warning.ALL_FIELDS_SHOULD_BE_USED).verify();
    }

    @Test
    void testSeasonDTOAnnotations() {
        SeasonDTO seasonDTO = new SeasonDTO();
        seasonDTO.setId(1L);
        seasonDTO.setName("Temporada 1");
        seasonDTO.setNumber(1);

        // @Getter
        assertEquals(1L, seasonDTO.getId());
        assertEquals("Temporada 1", seasonDTO.getName());
        assertEquals(1, seasonDTO.getNumber());

        // @Setter
        seasonDTO.setName("Temporada 2");
        seasonDTO.setNumber(2);
        assertEquals("Temporada 2", seasonDTO.getName());
        assertEquals(2, seasonDTO.getNumber());

        // @ToString
        String expectedToString = "SeasonDTO(id=1, name=Temporada 2, number=2)";
        assertEquals(expectedToString, seasonDTO.toString());

        // @AllArgsConstructor
        SeasonDTO allArgsSeasonDTO = new SeasonDTO(1L, "Temporada 2", 2);
        assertEquals(seasonDTO, allArgsSeasonDTO);

        // @NoArgsConstructor
        SeasonDTO noArgsConstructorSeasonDTO = new SeasonDTO();
        assertNotNull(noArgsConstructorSeasonDTO);

        // @EqualsAndHashCode
        EqualsVerifier.simple().forClass(SeasonDTO.class).verify(); 
    }
}
