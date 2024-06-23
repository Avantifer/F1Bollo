package formula.bollo.app.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import formula.bollo.app.FormulaBolloAppApplication;
import formula.bollo.app.model.FantasyPointsTeamDTO;
import formula.bollo.app.model.RaceDTO;
import formula.bollo.app.model.SeasonDTO;
import formula.bollo.app.model.TeamDTO;
import nl.jqno.equalsverifier.EqualsVerifier;
import nl.jqno.equalsverifier.Warning;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class FantasyPointsTeamTest {
    
    @Test
    void testFantasyPointsTeamAnnotations() {
        Team team = new Team(); 
        Race race = new Race(); 
        Season season = new Season(); 

        FantasyPointsTeam fantasyPointsTeam = new FantasyPointsTeam();
        fantasyPointsTeam.setId(1L);
        fantasyPointsTeam.setTeam(team);
        fantasyPointsTeam.setRace(race);
        fantasyPointsTeam.setPoints(150);
        fantasyPointsTeam.setSeason(season);

        // @Getter
        assertEquals(1L, fantasyPointsTeam.getId());
        assertEquals(team, fantasyPointsTeam.getTeam());
        assertEquals(race, fantasyPointsTeam.getRace());
        assertEquals(150, fantasyPointsTeam.getPoints());
        assertEquals(season, fantasyPointsTeam.getSeason());

        // @Setter
        Team newTeam = new Team(); 
        Race newRace = new Race(); 
        Season newSeason = new Season(); 

        fantasyPointsTeam.setTeam(newTeam);
        fantasyPointsTeam.setRace(newRace);
        fantasyPointsTeam.setPoints(200);
        fantasyPointsTeam.setSeason(newSeason);

        assertEquals(newTeam, fantasyPointsTeam.getTeam());
        assertEquals(newRace, fantasyPointsTeam.getRace());
        assertEquals(200, fantasyPointsTeam.getPoints());
        assertEquals(newSeason, fantasyPointsTeam.getSeason());

        // @ToString
        String expectedToString = "FantasyPointsTeam(id=1, team=" + newTeam + ", race=" + newRace + ", points=200, season=" + newSeason + ")";
        assertEquals(expectedToString, fantasyPointsTeam.toString());

        // @AllArgsConstructor
        FantasyPointsTeam allArgsConstructor = new FantasyPointsTeam(1L, newTeam, newRace, 200, newSeason);
        assertEquals(fantasyPointsTeam, allArgsConstructor);

        // @NoArgsConstructor
        FantasyPointsTeam noArgsConstructor = new FantasyPointsTeam();
        assertNotNull(noArgsConstructor);

        // @EqualsAndHashCode
        EqualsVerifier.forClass(FantasyPointsTeam.class).suppress(Warning.ALL_FIELDS_SHOULD_BE_USED).verify();
    }

    @Test
    void testFantasyPointsTeamDTOAnnotations() {
        TeamDTO teamDTO = new TeamDTO();
        RaceDTO raceDTO = new RaceDTO();
        SeasonDTO seasonDTO = new SeasonDTO();

        FantasyPointsTeamDTO fantasyPointsTeamDTO = new FantasyPointsTeamDTO();
        fantasyPointsTeamDTO.setId(1L);
        fantasyPointsTeamDTO.setTeam(teamDTO);
        fantasyPointsTeamDTO.setRace(raceDTO);
        fantasyPointsTeamDTO.setPoints(150);
        fantasyPointsTeamDTO.setSeason(seasonDTO);

        // @Getter
        assertEquals(1L, fantasyPointsTeamDTO.getId());
        assertEquals(teamDTO, fantasyPointsTeamDTO.getTeam());
        assertEquals(raceDTO, fantasyPointsTeamDTO.getRace());
        assertEquals(150, fantasyPointsTeamDTO.getPoints());
        assertEquals(seasonDTO, fantasyPointsTeamDTO.getSeason());

        TeamDTO newTeamDTO = new TeamDTO();
        RaceDTO newRaceDTO = new RaceDTO();
        SeasonDTO newSeasonDTO = new SeasonDTO();

        // @Setter
        fantasyPointsTeamDTO.setTeam(newTeamDTO);
        fantasyPointsTeamDTO.setRace(newRaceDTO);
        fantasyPointsTeamDTO.setPoints(200);
        fantasyPointsTeamDTO.setSeason(newSeasonDTO);

        assertEquals(newTeamDTO, fantasyPointsTeamDTO.getTeam());
        assertEquals(newRaceDTO, fantasyPointsTeamDTO.getRace());
        assertEquals(200, fantasyPointsTeamDTO.getPoints());
        assertEquals(newSeasonDTO, fantasyPointsTeamDTO.getSeason());

        // @ToString
        String expectedToString = "FantasyPointsTeamDTO(id=1, team=" + newTeamDTO + ", race=" + newRaceDTO + ", points=200, season=" + newSeasonDTO + ")";
        assertEquals(expectedToString, fantasyPointsTeamDTO.toString());

        // @AllArgsConstructor
        FantasyPointsTeamDTO allArgsConstructor = new FantasyPointsTeamDTO(1L, newTeamDTO, newRaceDTO, 200, newSeasonDTO);
        assertEquals(fantasyPointsTeamDTO, allArgsConstructor);

        // @NoArgsConstructor
        FantasyPointsTeamDTO noArgsConstructor = new FantasyPointsTeamDTO();
        assertNotNull(noArgsConstructor);

        // @EqualsAndHashCode
        EqualsVerifier.simple().forClass(FantasyPointsTeamDTO.class).verify();
    }
}
