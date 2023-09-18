package formula.bollo.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import formula.bollo.app.entity.Sprint;

@Repository
public interface SprintRepository extends JpaRepository<Sprint, Long> { 
    List<Sprint> findByDriverId(Long driverId);
}
