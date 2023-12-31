package formula.bollo.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import formula.bollo.app.entity.FantasyPointsTeam;

@Repository
public interface FantasyPointsTeamRepository  extends JpaRepository<FantasyPointsTeam, Long> {
    @Query("SELECT fp FROM FantasyPointsTeam fp WHERE fp.race.id = ?1")
    List<FantasyPointsTeam> findByRaceId(Long raceId);

    @Query("SELECT fp FROM FantasyPointsTeam fp WHERE fp.team.id = ?1")
    List<FantasyPointsTeam> findByTeamId(Long teamId);
}
