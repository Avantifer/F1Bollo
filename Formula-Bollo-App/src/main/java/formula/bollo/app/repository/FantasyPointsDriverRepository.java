package formula.bollo.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import formula.bollo.app.entity.FantasyPointsDriver;

@Repository
public interface FantasyPointsDriverRepository  extends JpaRepository<FantasyPointsDriver, Long> {
    @Query("SELECT fp FROM FantasyPointsDriver fp WHERE fp.race.id = ?1")
    List<FantasyPointsDriver> findByRaceId(Long raceId);

    @Query("SELECT fp FROM FantasyPointsDriver fp WHERE fp.driver.id = ?1")
    List<FantasyPointsDriver> findByDriverId(Long driverId);
}
