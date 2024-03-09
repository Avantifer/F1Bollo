package formula.bollo.app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import formula.bollo.app.entity.Result;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findByDriverId(Long driverId);

    @Query(value = "SELECT r FROM Result r WHERE r.race.id = ?1")
    List<Result> findByRaceId(Long race);

    @Query(value = "SELECT r FROM Result r WHERE r.season.number = ?1")
    List<Result> findBySeason(int seasonNumber);

    @Query(value = "SELECT r FROM Result r WHERE r.driver.id = ?1 AND r.pole = 1")
    List<Result> polesByDriverId(Long driverId);

    @Query(value = "SELECT r FROM Result r WHERE r.driver.id = ?1 AND r.fastlap = 1")
    List<Result> fastlapByDriverId(Long driverId);

    @Query(value = "SELECT r FROM Result r WHERE r.driver.id = ?1 AND r.position IS NOT NULL")
    List<Result> racesFinishedByDriverId(Long driverId);

    @Query(value = "SELECT r FROM Result r WHERE r.driver.id = ?1 AND r.position IS NOT NULL ORDER BY r.position ASC LIMIT 1")
    Optional<Result> bestResultOfDriver(Long driverId);

    @Query(value = "SELECT r FROM Result r WHERE r.driver.id = ?1 AND r.position.positionNumber = 1")
    List<Result> victoriesOfDriver(Long driverId);

    @Query(value = "SELECT r FROM Result r WHERE r.driver.id = ?1 AND r.position.positionNumber IS NOT NULL AND r.position.positionNumber <= 3")
    List<Result> podiumsOfDriver(Long driverId);
}
