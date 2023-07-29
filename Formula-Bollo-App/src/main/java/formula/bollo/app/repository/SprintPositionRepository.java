package formula.bollo.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import formula.bollo.app.entity.SprintPosition;

public interface SprintPositionRepository extends JpaRepository<SprintPosition, Long> { 
    
}

