package formula.bollo.app.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.sql.SQLException;
import java.sql.Blob;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import formula.bollo.app.FormulaBolloAppApplication;
import formula.bollo.app.model.SeasonDTO;
import formula.bollo.app.model.TeamDTO;
import nl.jqno.equalsverifier.EqualsVerifier;
import nl.jqno.equalsverifier.Warning;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class TeamTest {
    
    @Test
    void testTeamAnnotations() throws SQLException {
        Season season = new Season();
        Blob logoImage = new javax.sql.rowset.serial.SerialBlob(new byte[]{1, 2, 3});

        Team team = new Team();
        team.setId(1L);
        team.setName("Team Name");
        team.setCarImage("Car Image Path");
        team.setLogoImage(logoImage);
        team.setSeason(season);

        // @Getter
        assertEquals(1L, team.getId());
        assertEquals("Team Name", team.getName());
        assertEquals("Car Image Path", team.getCarImage());
        assertEquals(logoImage, team.getLogoImage());
        assertEquals(season, team.getSeason());

        // @Setter
        Season newSeason = new Season();
        Blob newLogoImage = new javax.sql.rowset.serial.SerialBlob(new byte[]{4, 5, 6});

        team.setName("New Team Name");
        team.setCarImage("New Car Image Path");
        team.setLogoImage(newLogoImage);
        team.setSeason(newSeason);

        assertEquals("New Team Name", team.getName());
        assertEquals("New Car Image Path", team.getCarImage());
        assertEquals(newLogoImage, team.getLogoImage());
        assertEquals(newSeason, team.getSeason());

        // @AllArgsConstructor
        Team allArgsConstructor = new Team(1L, "New Team Name", "New Car Image Path", newLogoImage, newSeason);
        assertEquals(team, allArgsConstructor);

        // @NoArgsConstructor
        Team noArgsConstructor = new Team();
        assertNotNull(noArgsConstructor);

        // @EqualsAndHashCode
        EqualsVerifier.forClass(Team.class).suppress(Warning.ALL_FIELDS_SHOULD_BE_USED).verify();
    }

    @Test
    void testTeamDTOAnnotations() {
        SeasonDTO seasonDTO = new SeasonDTO();
        TeamDTO teamDTO = new TeamDTO();
        
        teamDTO.setId(1L);
        teamDTO.setName("Team Name");
        teamDTO.setCarImage("Car Image Path");
        teamDTO.setLogoImage("Logo Image Path");
        teamDTO.setSeason(seasonDTO);

        // @Getter
        assertEquals(1L, teamDTO.getId());
        assertEquals("Team Name", teamDTO.getName());
        assertEquals("Car Image Path", teamDTO.getCarImage());
        assertEquals("Logo Image Path", teamDTO.getLogoImage());
        assertEquals(seasonDTO, teamDTO.getSeason());

        // @Setter
        SeasonDTO newSeasonDTO = new SeasonDTO();
        teamDTO.setName("New Team Name");
        teamDTO.setCarImage("New Car Image Path");
        teamDTO.setLogoImage("New Logo Image Path");
        teamDTO.setSeason(newSeasonDTO);

        assertEquals("New Team Name", teamDTO.getName());
        assertEquals("New Car Image Path", teamDTO.getCarImage());
        assertEquals("New Logo Image Path", teamDTO.getLogoImage());
        assertEquals(newSeasonDTO, teamDTO.getSeason());

        // @AllArgsConstructor
        TeamDTO allArgsConstructor = new TeamDTO(1L, "New Team Name", "New Car Image Path", "New Logo Image Path", newSeasonDTO);
        assertEquals(teamDTO, allArgsConstructor);

        // @NoArgsConstructor
        TeamDTO noArgsConstructor = new TeamDTO();
        assertNotNull(noArgsConstructor);

        // @EqualsAndHashCode
        EqualsVerifier.simple().forClass(TeamDTO.class).verify();
    }
}
