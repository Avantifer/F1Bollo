package formula.bollo.app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import formula.bollo.app.entity.FantasyPointsDriver;

@Repository
public interface FantasyPointsDriverRepository  extends JpaRepository<FantasyPointsDriver, Long> {
    @Query("SELECT fp FROM FantasyPointsDriver fp WHERE fp.season.id =?1 AND fp.race.id = ?2")
    List<FantasyPointsDriver> findByRaceId(int seasonNumber, Long raceId);

    @Query("SELECT fp FROM FantasyPointsDriver fp WHERE fp.driver.id = ?1")
    List<FantasyPointsDriver> findByDriverId(Long driverId);

    @Query("SELECT fp FROM FantasyPointsDriver fp WHERE fp.season.id =?1 AND fp.driver.id = ?2 AND fp.race.id = ?3")
    Optional<FantasyPointsDriver> findByDriverIdAndRaceId(int seasonNumber, Long driverId, Long raceId);
}
