package formula.bollo.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import formula.bollo.app.entity.Sprint;

@Repository
public interface SprintRepository extends JpaRepository<Sprint, Long> { 
    List<Sprint> findByDriverId(Long driverId);

    @Query(value = "SELECT s FROM Sprint s WHERE s.season.number = ?1")
    List<Sprint> findBySeason(int seasonNumber);

    @Query(value = "SELECT s FROM Sprint s WHERE s.race.id = ?1")
    List<Sprint> findByRaceId(Long race);
}
