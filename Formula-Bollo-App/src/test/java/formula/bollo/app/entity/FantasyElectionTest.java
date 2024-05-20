package formula.bollo.app.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import formula.bollo.app.FormulaBolloAppApplication;
import formula.bollo.app.model.AccountDTO;
import formula.bollo.app.model.DriverDTO;
import formula.bollo.app.model.FantasyElectionDTO;
import formula.bollo.app.model.RaceDTO;
import formula.bollo.app.model.SeasonDTO;
import formula.bollo.app.model.TeamDTO;
import nl.jqno.equalsverifier.EqualsVerifier;
import nl.jqno.equalsverifier.Warning;

@SpringBootTest(classes = FormulaBolloAppApplication.class)
@TestPropertySource(locations = "classpath:test.properties")
class FantasyElectionTest {
    
    @Test
    void testFantasyElectionAnnotations() {
        Account user = new Account();
        Driver driverOne = new Driver();
        Driver driverTwo = new Driver();
        Driver driverThree = new Driver();
        Team teamOne = new Team();
        Team teamTwo = new Team();
        Race race = new Race();
        Season season = new Season();

        FantasyElection fantasyElection = new FantasyElection();
        fantasyElection.setId(1L);
        fantasyElection.setUser(user);
        fantasyElection.setDriverOne(driverOne);
        fantasyElection.setDriverTwo(driverTwo);
        fantasyElection.setDriverThree(driverThree);
        fantasyElection.setTeamOne(teamOne);
        fantasyElection.setTeamTwo(teamTwo);
        fantasyElection.setRace(race);
        fantasyElection.setSeason(season);

        // @Getter
        assertEquals(1L, fantasyElection.getId());
        assertEquals(user, fantasyElection.getUser());
        assertEquals(driverOne, fantasyElection.getDriverOne());
        assertEquals(driverTwo, fantasyElection.getDriverTwo());
        assertEquals(driverThree, fantasyElection.getDriverThree());
        assertEquals(teamOne, fantasyElection.getTeamOne());
        assertEquals(teamTwo, fantasyElection.getTeamTwo());
        assertEquals(race, fantasyElection.getRace());
        assertEquals(season, fantasyElection.getSeason());

        // @Setter
        Account newUser = new Account();
        Driver newDriverOne = new Driver();
        Driver newDriverTwo = new Driver();
        Driver newDriverThree = new Driver();
        Team newTeamOne = new Team();
        Team newTeamTwo = new Team();
        Race newRace = new Race();
        Season newSeason = new Season();

        fantasyElection.setUser(newUser);
        fantasyElection.setDriverOne(newDriverOne);
        fantasyElection.setDriverTwo(newDriverTwo);
        fantasyElection.setDriverThree(newDriverThree);
        fantasyElection.setTeamOne(newTeamOne);
        fantasyElection.setTeamTwo(newTeamTwo);
        fantasyElection.setRace(newRace);
        fantasyElection.setSeason(newSeason);

        assertEquals(newUser, fantasyElection.getUser());
        assertEquals(newDriverOne, fantasyElection.getDriverOne());
        assertEquals(newDriverTwo, fantasyElection.getDriverTwo());
        assertEquals(newDriverThree, fantasyElection.getDriverThree());
        assertEquals(newTeamOne, fantasyElection.getTeamOne());
        assertEquals(newTeamTwo, fantasyElection.getTeamTwo());
        assertEquals(newRace, fantasyElection.getRace());
        assertEquals(newSeason, fantasyElection.getSeason());

        // @ToString
        String expectedToString = "FantasyElection(id=1, user=" + newUser + ", driverOne=" + newDriverOne + ", driverTwo=" + newDriverTwo + ", driverThree=" + newDriverThree + ", teamOne=" + newTeamOne + ", teamTwo=" + newTeamTwo + ", race=" + newRace + ", season=" + newSeason + ")";
        assertEquals(expectedToString, fantasyElection.toString());

        // @NoArgsConstructor
        FantasyElection noArgsConstructor = new FantasyElection();
        assertNotNull(noArgsConstructor);

        // @EqualsAndHashCode
        EqualsVerifier.forClass(FantasyElection.class).suppress(Warning.ALL_FIELDS_SHOULD_BE_USED).verify();
    }

    @Test
    void testFantasyElectionDTOAnnotations() {
        AccountDTO user = new AccountDTO();
        DriverDTO driverOne = new DriverDTO();
        DriverDTO driverTwo = new DriverDTO();
        DriverDTO driverThree = new DriverDTO();
        TeamDTO teamOne = new TeamDTO();
        TeamDTO teamTwo = new TeamDTO();
        RaceDTO race = new RaceDTO();
        SeasonDTO season = new SeasonDTO();

        FantasyElectionDTO fantasyElectionDTO = new FantasyElectionDTO();
        fantasyElectionDTO.setId(1L);
        fantasyElectionDTO.setUser(user);
        fantasyElectionDTO.setDriverOne(driverOne);
        fantasyElectionDTO.setDriverTwo(driverTwo);
        fantasyElectionDTO.setDriverThree(driverThree);
        fantasyElectionDTO.setTeamOne(teamOne);
        fantasyElectionDTO.setTeamTwo(teamTwo);
        fantasyElectionDTO.setRace(race);
        fantasyElectionDTO.setSeason(season);

        // @Getter
        assertEquals(1L, fantasyElectionDTO.getId());
        assertEquals(user, fantasyElectionDTO.getUser());
        assertEquals(driverOne, fantasyElectionDTO.getDriverOne());
        assertEquals(driverTwo, fantasyElectionDTO.getDriverTwo());
        assertEquals(driverThree, fantasyElectionDTO.getDriverThree());
        assertEquals(teamOne, fantasyElectionDTO.getTeamOne());
        assertEquals(teamTwo, fantasyElectionDTO.getTeamTwo());
        assertEquals(race, fantasyElectionDTO.getRace());
        assertEquals(season, fantasyElectionDTO.getSeason());

        // @Setter
        AccountDTO newUser = new AccountDTO();
        DriverDTO newDriverOne = new DriverDTO();
        DriverDTO newDriverTwo = new DriverDTO();
        DriverDTO newDriverThree = new DriverDTO();
        TeamDTO newTeamOne = new TeamDTO();
        TeamDTO newTeamTwo = new TeamDTO();
        RaceDTO newRace = new RaceDTO();
        SeasonDTO newSeason = new SeasonDTO();

        fantasyElectionDTO.setUser(newUser);
        fantasyElectionDTO.setDriverOne(newDriverOne);
        fantasyElectionDTO.setDriverTwo(newDriverTwo);
        fantasyElectionDTO.setDriverThree(newDriverThree);
        fantasyElectionDTO.setTeamOne(newTeamOne);
        fantasyElectionDTO.setTeamTwo(newTeamTwo);
        fantasyElectionDTO.setRace(newRace);
        fantasyElectionDTO.setSeason(newSeason);

        assertEquals(newUser, fantasyElectionDTO.getUser());
        assertEquals(newDriverOne, fantasyElectionDTO.getDriverOne());
        assertEquals(newDriverTwo, fantasyElectionDTO.getDriverTwo());
        assertEquals(newDriverThree, fantasyElectionDTO.getDriverThree());
        assertEquals(newTeamOne, fantasyElectionDTO.getTeamOne());
        assertEquals(newTeamTwo, fantasyElectionDTO.getTeamTwo());
        assertEquals(newRace, fantasyElectionDTO.getRace());
        assertEquals(newSeason, fantasyElectionDTO.getSeason());

        // @ToString
        String expectedToString = "FantasyElectionDTO(id=1, user=" + newUser + ", driverOne=" + newDriverOne + ", driverTwo=" + newDriverTwo + ", driverThree=" + newDriverThree + ", teamOne=" + newTeamOne + ", teamTwo=" + newTeamTwo + ", race=" + newRace + ", season=" + newSeason + ")";
        assertEquals(expectedToString, fantasyElectionDTO.toString());

        // @NoArgsConstructor
        FantasyElectionDTO noArgsConstructor = new FantasyElectionDTO();
        assertNotNull(noArgsConstructor);

        // @EqualsAndHashCode
        EqualsVerifier.simple().forClass(FantasyElectionDTO.class).verify();
    }
}
