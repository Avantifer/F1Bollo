package formula.bollo.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import formula.bollo.app.entity.Race;

public interface RaceRepository extends JpaRepository<Race, Long> {

    @Query(value = "SELECT r FROM Race r WHERE r.circuit.id = ?1")
    List<Race> findByCircuitId(Long circuitId);
}
