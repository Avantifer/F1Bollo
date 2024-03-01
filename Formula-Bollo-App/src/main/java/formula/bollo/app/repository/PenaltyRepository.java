package formula.bollo.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import formula.bollo.app.entity.Penalty;

@Repository
public interface PenaltyRepository extends JpaRepository<Penalty, Long>{
    @Query(value = "SELECT p FROM Penalty p WHERE p.driver.id = ?1")
    List<Penalty> findByDriverId(Long driverId);
    @Query(value = "SELECT p FROM Penalty p WHERE p.driver.id = ?1 AND p.season.number = ?2")
    List<Penalty> findByDriverIdAndSeason(Long driverId, int seasonNumber);

    @Query(value = "SELECT p FROM Penalty p WHERE p.race.id = ?1 AND p.season.number = ?2")
    List<Penalty> findByRaceId(Long race, int seasonNumber);

    @Query(value = "SELECT p FROM Penalty p WHERE p.season.number = ?1")
    List<Penalty> findBySeason(int seasonNumber);

    @Query(value = "SELECT p FROM Penalty p WHERE p.driver.id = ?1 AND p.race.id = ?2 AND p.severity.id = ?3 AND p.season.number = ?4")
    List<Penalty> findByDriverAndRaceAndSeverity(Long driverId, Long raceId, Long severityId, int seasonNumber);
}
