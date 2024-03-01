package formula.bollo.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import formula.bollo.app.entity.Championship;

@Repository
public interface ChampionshipRepository extends JpaRepository<Championship, Long> {

    @Query(value = "SELECT c FROM Championship c WHERE c.driver.id = ?1")
    List<Championship> findByDriverId(Long driverId);
}
