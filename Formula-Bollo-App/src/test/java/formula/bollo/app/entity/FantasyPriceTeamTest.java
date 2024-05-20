package formula.bollo.app.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import formula.bollo.app.FormulaBolloAppApplication;
import formula.bollo.app.model.FantasyPriceTeamDTO;
import formula.bollo.app.model.RaceDTO;
import formula.bollo.app.model.SeasonDTO;
import formula.bollo.app.model.TeamDTO;
import nl.jqno.equalsverifier.EqualsVerifier;
import nl.jqno.equalsverifier.Warning;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class FantasyPriceTeamTest {
    
    @Test
    void testFantasyPriceTeamAnnotations() {
        Team team = new Team();
        Race race = new Race();
        Season season = new Season();

        FantasyPriceTeam fantasyPriceTeam = new FantasyPriceTeam();
        fantasyPriceTeam.setId(1L);
        fantasyPriceTeam.setTeam(team);
        fantasyPriceTeam.setRace(race);
        fantasyPriceTeam.setPrice(100);
        fantasyPriceTeam.setSeason(season);

        // @Getter
        assertEquals(1L, fantasyPriceTeam.getId());
        assertEquals(team, fantasyPriceTeam.getTeam());
        assertEquals(race, fantasyPriceTeam.getRace());
        assertEquals(100, fantasyPriceTeam.getPrice());
        assertEquals(season, fantasyPriceTeam.getSeason());

        // @Setter
        Team newTeam = new Team();
        Race newRace = new Race();
        Season newSeason = new Season();

        fantasyPriceTeam.setTeam(newTeam);
        fantasyPriceTeam.setRace(newRace);
        fantasyPriceTeam.setPrice(200);
        fantasyPriceTeam.setSeason(newSeason);

        assertEquals(newTeam, fantasyPriceTeam.getTeam());
        assertEquals(newRace, fantasyPriceTeam.getRace());
        assertEquals(200, fantasyPriceTeam.getPrice());
        assertEquals(newSeason, fantasyPriceTeam.getSeason());

        // @ToString
        String expectedToString = "FantasyPriceTeam(id=1, team=" + newTeam + ", race=" + newRace + ", price=200, season=" + newSeason + ")";
        assertEquals(expectedToString, fantasyPriceTeam.toString());

        // @AllArgsConstructor
        FantasyPriceTeam allArgsConstructor = new FantasyPriceTeam(1L, newTeam, newRace, 200, newSeason);
        assertEquals(fantasyPriceTeam, allArgsConstructor);

        // @NoArgsConstructor
        FantasyPriceTeam noArgsConstructor = new FantasyPriceTeam();
        assertNotNull(noArgsConstructor);

        // @EqualsAndHashCode
        EqualsVerifier.forClass(FantasyPriceTeam.class).suppress(Warning.ALL_FIELDS_SHOULD_BE_USED).verify();
    }

    @Test
    void testFantasyPriceTeamDTOAnnotations() {
        TeamDTO teamDTO = new TeamDTO();
        RaceDTO raceDTO = new RaceDTO();
        SeasonDTO seasonDTO = new SeasonDTO();

        FantasyPriceTeamDTO fantasyPriceTeamDTO = new FantasyPriceTeamDTO();
        fantasyPriceTeamDTO.setId(1L);
        fantasyPriceTeamDTO.setTeam(teamDTO);
        fantasyPriceTeamDTO.setRace(raceDTO);
        fantasyPriceTeamDTO.setPrice(100);
        fantasyPriceTeamDTO.setSeason(seasonDTO);

        // @Getter
        assertEquals(1L, fantasyPriceTeamDTO.getId());
        assertEquals(teamDTO, fantasyPriceTeamDTO.getTeam());
        assertEquals(raceDTO, fantasyPriceTeamDTO.getRace());
        assertEquals(100, fantasyPriceTeamDTO.getPrice());
        assertEquals(seasonDTO, fantasyPriceTeamDTO.getSeason());

        // @Setter
        TeamDTO newTeamDTO = new TeamDTO();
        RaceDTO newRaceDTO = new RaceDTO();
        SeasonDTO newSeasonDTO = new SeasonDTO();

        fantasyPriceTeamDTO.setTeam(newTeamDTO);
        fantasyPriceTeamDTO.setRace(newRaceDTO);
        fantasyPriceTeamDTO.setPrice(200);
        fantasyPriceTeamDTO.setSeason(newSeasonDTO);

        assertEquals(newTeamDTO, fantasyPriceTeamDTO.getTeam());
        assertEquals(newRaceDTO, fantasyPriceTeamDTO.getRace());
        assertEquals(200, fantasyPriceTeamDTO.getPrice());
        assertEquals(newSeasonDTO, fantasyPriceTeamDTO.getSeason());

        // @ToString
        String expectedToString = "FantasyPriceTeamDTO(id=1, team=" + newTeamDTO + ", race=" + newRaceDTO + ", price=200, season=" + newSeasonDTO + ")";
        assertEquals(expectedToString, fantasyPriceTeamDTO.toString());

        // @AllArgsConstructor
        FantasyPriceTeamDTO allArgsConstructor = new FantasyPriceTeamDTO(1L, newTeamDTO, newRaceDTO, 200, newSeasonDTO);
        assertEquals(fantasyPriceTeamDTO, allArgsConstructor);

        // @NoArgsConstructor
        FantasyPriceTeamDTO noArgsConstructor = new FantasyPriceTeamDTO();
        assertNotNull(noArgsConstructor);

        // @EqualsAndHashCode
        EqualsVerifier.simple().forClass(FantasyPriceTeamDTO.class).verify();
    }
}
