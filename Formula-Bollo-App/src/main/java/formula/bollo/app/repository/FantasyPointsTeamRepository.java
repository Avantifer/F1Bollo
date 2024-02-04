package formula.bollo.app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import formula.bollo.app.entity.FantasyPointsTeam;

@Repository
public interface FantasyPointsTeamRepository  extends JpaRepository<FantasyPointsTeam, Long> {
    @Query("SELECT fp FROM FantasyPointsTeam fp WHERE fp.season.id = ?1 AND fp.race.id = ?2")
    List<FantasyPointsTeam> findByRaceId(int season, Long raceId);

    @Query("SELECT fp FROM FantasyPointsTeam fp WHERE fp.team.id = ?1")
    List<FantasyPointsTeam> findByTeamId(Long teamId);

    @Query("SELECT fp FROM FantasyPointsTeam fp WHERE fp.season.id =?1 AND fp.team.id = ?2 AND fp.race.id = ?3")
    Optional<FantasyPointsTeam> findByTeamIdAndRaceId(int seasonNumber, Long teamId, Long raceId);
}
