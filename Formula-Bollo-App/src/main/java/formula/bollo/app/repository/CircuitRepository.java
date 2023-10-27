package formula.bollo.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import formula.bollo.app.entity.Circuit;

@Repository
public interface CircuitRepository extends JpaRepository<Circuit, Long>{
    @Query(value = "SELECT c FROM Circuit c WHERE c.season.number = ?1")
    List<Circuit> findBySeason(int seasonNumber);
}
