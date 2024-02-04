package formula.bollo.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import formula.bollo.app.entity.FantasyPriceTeam;

@Repository
public interface FantasyPriceTeamRepository  extends JpaRepository<FantasyPriceTeam, Long> {
    @Query("SELECT fp FROM FantasyPriceTeam fp WHERE fp.race.id = ?1")
    List<FantasyPriceTeam> findByRaceId(Long raceId);

    @Query("SELECT fp FROM FantasyPriceTeam fp WHERE fp.team.id = ?1 ORDER BY fp.race.id DESC LIMIT 2")
    List<FantasyPriceTeam> findTwoLastPrices(Long teamId);
}
