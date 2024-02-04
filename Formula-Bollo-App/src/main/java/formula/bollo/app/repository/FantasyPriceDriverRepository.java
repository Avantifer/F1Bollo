package formula.bollo.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import formula.bollo.app.entity.FantasyPriceDriver;

@Repository
public interface FantasyPriceDriverRepository  extends JpaRepository<FantasyPriceDriver, Long> {
    @Query("SELECT fp FROM FantasyPriceDriver fp WHERE fp.race.id = ?1")
    List<FantasyPriceDriver> findByRaceId(Long raceId);

    @Query("SELECT fp FROM FantasyPriceDriver fp WHERE fp.driver.id = ?1 ORDER BY fp.race.id DESC LIMIT 2")
    List<FantasyPriceDriver> findTwoLastPrices(Long driverId);
}
