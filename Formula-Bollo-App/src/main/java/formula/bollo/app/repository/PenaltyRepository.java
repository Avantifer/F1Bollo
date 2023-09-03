package formula.bollo.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import formula.bollo.app.entity.Penalty;

public interface PenaltyRepository extends JpaRepository<Penalty, Long>{
    List<Penalty> findByDriverId(Long driverId);

    @Query(value = "SELECT p FROM Penalty p WHERE p.race.id = ?1")
    List<Penalty> findByRaceId(Long race);

    @Query(value = "SELECT p FROM Penalty p WHERE p.driver.id = ?1 AND p.race.id = ?2 AND p.severity.id = ?3")
    List<Penalty> findByDriverAndRaceAndSeverity(Long driverId, Long raceId, Long severityId);
}
