package formula.bollo.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import formula.bollo.app.entity.Sprint;

public interface SprintRepository extends JpaRepository<Sprint, Long> { 
    List<Sprint> findByDriverId(Long driverId);
}
