package formula.bollo.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import formula.bollo.app.entity.PenaltySeverity;

public interface PenaltySeverityRepository extends JpaRepository<PenaltySeverity, Long>{
    
}
