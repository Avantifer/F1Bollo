package formula.bollo.app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import formula.bollo.app.entity.FantasyElection;

@Repository
public interface FantasyElectionRepository extends JpaRepository<FantasyElection, Long>{
    @Query(value = "SELECT fe FROM FantasyElection fe WHERE fe.season.number = ?1")
    List<FantasyElection> findBySeason(int seasonNumber);

    @Query(value = "SELECT fe FROM FantasyElection fe WHERE fe.season.number = ?1 AND fe.race.id = ?2")
    List<FantasyElection> findBySeasonAndRaceId(int seasonNumber, Long raceId);

    @Query(value = "SELECT fe FROM FantasyElection fe WHERE fe.season.number =?1 AND fe.user.id = ?2 AND fe.race.id = ?3")
    Optional<FantasyElection> findBySeasonUserIdAndRaceId(int seasonNumber, Long userId, Long raceId);
}
