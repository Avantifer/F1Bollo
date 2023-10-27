package formula.bollo.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import formula.bollo.app.entity.Race;

@Repository
public interface RaceRepository extends JpaRepository<Race, Long> {
    @Query(value = "SELECT r FROM Race r WHERE r.circuit.id = ?1 AND r.season.number = ?2")
    List<Race> findByCircuitId(Long circuitId, int seasonNumber);

    @Query(value = "SELECT r FROM Race r WHERE r.season.number = ?1")
    List<Race> findBySeason(int seasonNumber);
}
