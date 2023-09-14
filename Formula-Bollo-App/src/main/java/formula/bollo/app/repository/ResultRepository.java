package formula.bollo.app.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import formula.bollo.app.entity.Result;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findByDriverId(Long driverId);

    @Query(value = "SELECT r FROM Result r WHERE r.race.id = ?1")
    List<Result> findByRaceId(Long race);
}
